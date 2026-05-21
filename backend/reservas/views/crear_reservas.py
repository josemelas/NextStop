from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import uuid
from vuelos.models import Vuelo
from reservas.models import Reserva
from django.core.mail import send_mail
from django.conf import settings

class CrearReserva(APIView):
    def post(self, request):
        api_id_vuelo = request.data.get('vuelo_id')
        id_usuario = request.data.get('usuario_id')
        pasajeros = request.data.get('cantidad_pasajeros', 1)
        asientos = request.data.get('asientos')
        monto = request.data.get('monto_total')

        if not all([api_id_vuelo, id_usuario, monto]):
            return Response({"error": "Faltan datos obligatorios para la reserva"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                vuelo = Vuelo.objects.get(api_id=api_id_vuelo)

                if vuelo.asientos_disponibles < pasajeros:
                    return Response({"error": "El vuelo ya no tiene suficientes asientos disponibles"}, status=status.HTTP_400_BAD_REQUEST)

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
                    asunto_correo = f"✈️ Confirmación de tu Vuelo: {reserva.codigo_confirmacion}"
                    fecha = vuelo.fecha_salida.strftime("%d/%m/%Y")
                    hora = vuelo.fecha_salida.strftime("%H:%M")

                    mensaje_cuerpo = f"""
                                    ¡Hola {usuario_comprador.nombre}! 

                                    Tu pago ha sido procesado de manera segura. Aquí tienes los detalles de tu próximo viaje con NextStop:

                                    =========================================
                                         PASE DE ABORDAJE DIGITAL
                                    =========================================
                                    Código de Confirmación: {reserva.codigo_confirmacion}
                                    Aerolínea: {vuelo.aerolinea}
                                    Código de Vuelo: {vuelo.codigo_vuelo}
                                    Ruta: {vuelo.origen} ➡️ {vuelo.destino}
                                    Fecha de Salida: {fecha}
                                    Hora de Salida: {hora} HRS
                                    Asiento(s) Asignado(s): {reserva.asiento_asignado if reserva.asiento_asignado else 'Por asignar'}
                                    Pasajeros: {reserva.cantidad_pasajeros}
                                    -----------------------------------------
                                    Monto Total Cargado: ${reserva.monto_total} MXN
                                    =========================================

                                    Ya puedes consultar tu boleto y el código QR desde tu Perfil en nuestra aplicación.

                                    ¡Gracias por confiar en NextStop y que tengas un excelente viaje!

                                    El equipo de NextStop
                                    """

                    send_mail(
                        subject=asunto_correo,
                        message=mensaje_cuerpo,
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[usuario_comprador.email],
                        fail_silently=False,
                    )

                except Exception as mail_error:
                    print(f"Advertencia: No se pudo enviar el correo de confirmación: {str(mail_error)}")

                return Response({
                    "mensaje": "¡Vuelo Confirmado!",
                    "codigo_confirmacion": reserva.codigo_confirmacion,
                    "estado": reserva.estado_pago
                }, status=status.HTTP_201_CREATED)

        except Vuelo.DoesNotExist:
            return Response({"error": "El vuelo seleccionado ya no está disponible"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)