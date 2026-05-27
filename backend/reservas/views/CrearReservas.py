from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import uuid
from vuelos.models import Vuelo
from reservas.models import Reserva
from favoritos.models import Favorito
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from apis_externas.models import Aeropuertos
from django.utils import timezone

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

                estado_actual = getattr(vuelo, 'estado_vuelo', 'A Tiempo')
                estados_bloqueados = ['Cancelado', 'Abordando']

                if estado_actual in estados_bloqueados:
                    return Response(
                        {
                            "error": f"Operación rechazada: No se pueden comprar boletos porque el vuelo está {estado_actual}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                from usuarios.models import Usuario
                usuario_comprador = Usuario.objects.get(id=id_usuario)

                nuevos_nombres = []
                for pasajero in datos_pasajeros:
                    nombre_extra = pasajero.get('nombre')
                    if nombre_extra:
                        nuevos_nombres.append(nombre_extra.strip().lower())

                reservas_vuelo = Reserva.objects.filter(id_vuelo=vuelo, estado_pago='PAGADO')
                nombres_ya_registrados = []
                for r in reservas_vuelo:
                    if r.nombres_pasajeros:
                        nombres_limpios = [n.strip().lower() for n in r.nombres_pasajeros.split(',')]
                        nombres_ya_registrados.extend(nombres_limpios)

                for nombre in nuevos_nombres:
                    if nombre in nombres_ya_registrados:
                        return Response(
                            {"error": f"El pasajero '{nombre.title()}' ya tiene un boleto comprado para este vuelo."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                if vuelo.asientos_disponibles < pasajeros:
                    return Response({"error": "El vuelo ya no tiene suficientes asientos disponibles"},
                                    status=status.HTTP_400_BAD_REQUEST)

                vuelo.asientos_disponibles -= pasajeros
                vuelo.save()

                codigo_reserva = f"NS-{uuid.uuid4().hex[:6].upper()}"
                nombres_a_guardar = ", ".join([n.title() for n in nuevos_nombres])

                reserva = Reserva.objects.create(
                    id_usuario_id=id_usuario,
                    id_vuelo=vuelo,
                    codigo_confirmacion=codigo_reserva,
                    monto_total=monto,
                    estado_pago='PAGADO',
                    cantidad_pasajeros=pasajeros,
                    asiento_asignado=asientos,
                    nombres_pasajeros=nombres_a_guardar,
                    fecha_transaccion=timezone.now()
                )

                try:
                    Favorito.objects.filter(
                        id_usuario_id=id_usuario,
                        tipo_recurso='VUELO',
                        id_recurso=api_id_vuelo
                    ).delete()
                except Exception as e:
                    print(f"Nota: Fallo silencioso al borrar favorito: {str(e)}")

                try:
                    usuario_comprador = reserva.id_usuario
                    pasajeros_a_notificar = []

                    pasajeros_a_notificar.append({
                        "nombre": usuario_comprador.nombre,
                        "correo": usuario_comprador.email
                    })

                    for pasajero in datos_pasajeros:
                        correo_extra = pasajero.get('correo')
                        nombre_extra = pasajero.get('nombre')

                        if correo_extra and nombre_extra:
                            correos_existentes = [p['correo'] for p in pasajeros_a_notificar]
                            if correo_extra not in correos_existentes:
                                pasajeros_a_notificar.append({
                                    "nombre": nombre_extra,
                                    "correo": correo_extra
                                })

                    asunto_correo = f"Confirmación de tu Vuelo: {reserva.codigo_confirmacion}"
                    aeropuertos_info = {
                        a.codigo: f"{a.ciudad}, {a.pais}"
                        for a in Aeropuertos.objects.filter(codigo__in=[vuelo.origen, vuelo.destino])
                    }
                    nombre_origen = aeropuertos_info.get(vuelo.origen, "")
                    nombre_destino = aeropuertos_info.get(vuelo.destino, "")

                    for persona in pasajeros_a_notificar:
                        contexto = {
                            "nombre_usuario": persona["nombre"],
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
                            recipient_list=[persona["correo"]],
                            html_message=html_mensaje,
                            fail_silently=True,
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