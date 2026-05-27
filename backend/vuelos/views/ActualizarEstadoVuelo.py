from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario
from reservas.models import Reserva
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class ActualizarEstadoVuelo(APIView):
    permission_classes = []

    def patch(self, request, api_id_vuelo):
        nuevo_estado = request.data.get('estado_vuelo')
        usuario_id = request.data.get('usuario_id')

        if not nuevo_estado or not usuario_id:
            return Response(
                {"error": "Faltan datos obligatorios: se requiere estado_vuelo y usuario_id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario_logueado = Usuario.objects.get(id=usuario_id)
            vuelo = Vuelo.objects.get(api_id=api_id_vuelo)

            id_proveedor_vuelo = vuelo.id_proveedor_id
            id_proveedor_usuario = usuario_logueado.id_proveedor_id
            if not id_proveedor_usuario:
                return Response(
                    {"error": "Este usuario no es una aerolínea autorizada."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if str(id_proveedor_vuelo) != str(id_proveedor_usuario):
                return Response(
                    {"error": "Operación rechazada: No puedes modificar los estados de vuelos de la competencia."},
                    status=status.HTTP_403_FORBIDDEN
                )
            estado_anterior = vuelo.estado_vuelo

            vuelo.estado_vuelo = nuevo_estado
            vuelo.full_clean()
            vuelo.save()
            estados_alertas = ['Cancelado', 'Retrasado', 'Reprogramado']

            if nuevo_estado in estados_alertas and nuevo_estado != estado_anterior:
                try:
                    reservas_afectadas = Reserva.objects.filter(id_vuelo=vuelo, estado_pago='PAGADO').select_related(
                        'id_usuario')

                    pasajeros_notificar = {}
                    for r in reservas_afectadas:
                        if r.id_usuario and r.id_usuario.email:
                            pasajeros_notificar[r.id_usuario.email] = {
                                "nombre": r.id_usuario.nombre,
                                "codigo_confirmacion": r.codigo_confirmacion
                            }

                    asunto_correo = f"AVISO IMPORTANTE: Tu vuelo {vuelo.codigo_vuelo} cambio a {nuevo_estado}"
                    fecha_formateada = vuelo.fecha_salida.strftime("%d/%m/%Y a las %H:%M Hrs")

                    for email, info in pasajeros_notificar.items():
                        contexto = {
                            "nombre_usuario": info["nombre"],
                            "codigo_confirmacion": info["codigo_confirmacion"],
                            "codigo_vuelo": vuelo.codigo_vuelo,
                            "nuevo_estado": nuevo_estado,
                            "origen": vuelo.origen,
                            "destino": vuelo.destino,
                            "fecha_salida": fecha_formateada
                        }

                        html_mensaje = render_to_string('vuelos/email_notificacion_estado.html', contexto)
                        mensaje_plano = strip_tags(html_mensaje)

                        send_mail(
                            subject=asunto_correo,
                            message=mensaje_plano,
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[email],
                            html_message=html_mensaje,
                            fail_silently=True
                        )
                except Exception as e_mail:
                    print(f"Advertencia: Error al procesar la cola de correos operacionales: {str(e_mail)}")

            return Response({
                "mensaje": "Estado del vuelo actualizado exitosamente y pasajeros notificados.",
                "nuevo_estado": vuelo.estado_vuelo
            }, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "El usuario no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Vuelo.DoesNotExist:
            return Response({"error": "Vuelo no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Estado no válido o error interno: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)