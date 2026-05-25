from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.mail import EmailMessage
from django.conf import settings

class EnviarMensajeContacto(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        nombre = request.data.get('nombre')
        correo = request.data.get('correo')
        mensaje_cliente = request.data.get('mensaje')

        if not nombre or not correo or not mensaje_cliente:
            return Response(
                {"error": "Todos los campos (nombre, correo, mensaje) son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            asunto = f"Nuevo mensaje de NextStop de: {nombre}"

            cuerpo_correo = f"""
            Has recibido un nuevo mensaje desde el formulario de soporte de NextStop.

            Nombre del cliente: {nombre}
            Correo de contacto: {correo}

            Mensaje:
            {mensaje_cliente}
            """

            email = EmailMessage(
                subject=asunto,
                body=cuerpo_correo,
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER],
                reply_to=[correo]
            )

            email.send(fail_silently=False)

            return Response(
                {"mensaje": "Tu mensaje ha sido enviado con éxito. Te contactaremos pronto."},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Error al intentar enviar el correo: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )