from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario
from vuelos.models import Proveedorapi
from reservas.models import Reserva

from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class EliminarVuelo(APIView):
    permission_classes = []

    def delete(self, request):
        vuelo_id = request.query_params.get('vuelo_id')
        usuario_id = request.query_params.get('usuario_id')

        if not vuelo_id or not usuario_id:
            return Response({"error": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario_logueado = Usuario.objects.get(id=usuario_id)
            vuelo = Vuelo.objects.get(api_id=vuelo_id)

            id_proveedor_vuelo = vuelo.id_proveedor_id
            id_proveedor_usuario = usuario_logueado.id_proveedor_id

            print(f"--- DEBUG ELIMINAR --- Vuelo de: {id_proveedor_vuelo} | Usuario de: {id_proveedor_usuario}")

            if not id_proveedor_usuario:
                return Response({"error": "Este usuario no es una aerolínea autorizada."},
                                status=status.HTTP_403_FORBIDDEN)

            if str(id_proveedor_vuelo) != str(id_proveedor_usuario):
                return Response({"error": "Operación rechazada: No puedes borrar vuelos de la competencia"},
                                status=status.HTTP_403_FORBIDDEN)

            reservas_afectadas = Reserva.objects.filter(id_vuelo=vuelo, estado_pago='PAGADO')

            if reservas_afectadas.exists():
                asunto_cancelacion = f"🚨 NOTIFICACIÓN URGENTE: Cancelación de tu vuelo {vuelo.codigo_vuelo}"

                for reserva in reservas_afectadas:
                    try:
                        comprador = reserva.id_usuario
                        contexto = {
                            "nombre_usuario": comprador.nombre,
                            "aerolinea": vuelo.aerolinea,
                            "codigo_confirmacion": reserva.codigo_confirmacion,
                            "codigo_vuelo": vuelo.codigo_vuelo,
                            "origen": vuelo.origen,
                            "destino": vuelo.destino,
                            "fecha": vuelo.fecha_salida.strftime("%d/%m/%Y"),
                            "hora": vuelo.fecha_salida.strftime("%H:%M"),
                            "monto": reserva.monto_total
                        }
                        html_mensaje = render_to_string('vuelos/email_cancelación.html', contexto)
                        mensaje_texto = strip_tags(html_mensaje)

                        send_mail(
                            subject=asunto_cancelacion,
                            message=mensaje_texto,
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[comprador.email],
                            html_message=html_mensaje,
                            fail_silently=True
                        )
                    except Exception as single_mail_error:
                        print(f"No se pudo notificar a {reserva.id_usuario.email}: {str(single_mail_error)}")

            vuelo.delete()

            return Response({"mensaje": "Vuelo eliminado exitosamente e itinerarios notificados."},
                            status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "El usuario no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Vuelo.DoesNotExist:
            return Response({"error": "El vuelo no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)