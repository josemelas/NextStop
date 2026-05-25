from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import uuid
from vuelos.models import Vuelo
from reservas.models import Reserva
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from apis_externas.models import Aeropuertos


class CrearReserva(APIView):
    def post(self, request):
        api_id_vuelo = request.data.get('vuelo_id')
        id_usuario = request.data.get('usuario_id')
        pasajeros = request.data.get('cantidad_pasajeros', 1)
        asientos = request.data.get('asientos')
        monto = request.data.get('monto_total')
        datos_pasajeros = request.data.get('datos_pasajeros', [])

        if not all([api_id_vuelo, id_usuario, monto]):
            return Response({"error": "Faltan datos obligatorios para la reserva"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                vuelo = Vuelo.objects.get(api_id=api_id_vuelo)

                if vuelo.asientos_disponibles < pasajeros:
                    return Response({"error": "El vuelo ya no tiene suficientes asientos disponibles"},
                                    status=status.HTTP_400_BAD_REQUEST)

                vuelo.asientos_disponibles -= pasajeros
                vuelo.save()

                codigo_reserva = f"NS-{uuid.uuid4().hex[:6].upper()}"

                reserva = Reserva.objects.create(
                    id_usuario_id=id_usuario,
                    id_vuelo=vuelo,
                    codigo_confirmacion=codigo_reserva,
                    monto_total=monto,
                    estado_pago='PAGADO',
                    cantidad_pasajeros=pasajeros,
                    asiento_asignado=asientos
                )

                try:
                    usuario_comprador = reserva.id_usuario
                    lista_destinatarios = [usuario_comprador.email]
                    for pasajero in datos_pasajeros:
                        correo_extra = pasajero.get('correo')
                        if correo_extra and correo_extra not in lista_destinatarios:
                            lista_destinatarios.append(correo_extra)

                    asunto_correo = f"Confirmación de tu Vuelo: {reserva.codigo_confirmacion}"
                    aeropuertos_info = {
                        a.codigo: f"{a.ciudad}, {a.pais}"
                        for a in Aeropuertos.objects.filter(codigo__in=[vuelo.origen, vuelo.destino])
                    }
                    nombre_origen = aeropuertos_info.get(vuelo.origen, "")
                    nombre_destino = aeropuertos_info.get(vuelo.destino, "")

                    contexto = {
                        "nombre_usuario": usuario_comprador.nombre,
                        "codigo_confirmacion": reserva.codigo_confirmacion,
                        "origen_codigo": vuelo.origen,
                        "origen_nombre": nombre_origen,
                        "destino_codigo": vuelo.destino,
                        "destino_nombre": nombre_destino,
                        "fecha": vuelo.fecha_salida.strftime("%d/%m/%Y"),
                        "hora": vuelo.fecha_salida.strftime("%H:%M"),
                        "asientos": reserva.asiento_asignado if reserva.asiento_asignado else 'Por asignar',
                        "monto": reserva.monto_total
                    }

                    html_mensaje = render_to_string('reservas/email_confirmacion.html', contexto)
                    mensaje_texto = strip_tags(html_mensaje)

                    send_mail(
                        subject=asunto_correo,
                        message=mensaje_texto,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=lista_destinatarios,
                        html_message=html_mensaje,
                        fail_silently=False,
                    )

                except Exception as mail_error:
                    print(f"Advertencia: No se pudo enviar el correo de confirmación a todos: {str(mail_error)}")

                return Response({
                    "mensaje": "¡Vuelo Confirmado!",
                    "codigo_confirmacion": reserva.codigo_confirmacion,
                    "estado": reserva.estado_pago
                }, status=status.HTTP_201_CREATED)

        except Vuelo.DoesNotExist:
            return Response({"error": "El vuelo seleccionado ya no está disponible"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)