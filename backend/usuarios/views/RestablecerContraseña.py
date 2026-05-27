from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from usuarios.models import Usuario
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class SolicitarRestablecimientoPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({"error": "El correo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(usuario)
            uid = urlsafe_base64_encode(force_bytes(usuario.pk))
            enlace_frontend = f"https://seal-app-u4egd.ondigitalocean.app/recuperar-password?uid={uid}&token={token}"
            contexto = {
                'nombre_usuario': usuario.nombre,
                'enlace_frontend': enlace_frontend
            }
            html_mensaje = render_to_string('usuarios/email_restablecer_password.html', contexto)
            mensaje_texto_plano = strip_tags(html_mensaje)

            send_mail(
                subject="Restablecimiento de contraseña - NextStop",
                message=mensaje_texto_plano,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[usuario.email],
                html_message=html_mensaje,
                fail_silently=False,
            )

        except Usuario.DoesNotExist:
            pass

        return Response({
            "mensaje": "Si el correo está registrado, recibirás un enlace de recuperación."
        }, status=status.HTTP_200_OK)


class ConfirmarRestablecimientoPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid_b64 = request.data.get('uid')
        token = request.data.get('token')
        nueva_password = request.data.get('nueva_password')

        if not all([uid_b64, token, nueva_password]):
            return Response({"error": "Faltan datos obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uid_b64))
            usuario = Usuario.objects.get(pk=uid)

            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(usuario, token):
                return Response({"error": "El enlace es inválido o ya expiró."}, status=status.HTTP_400_BAD_REQUEST)

            usuario.set_password(nueva_password)
            usuario.save()

            return Response({"mensaje": "¡Tu contraseña ha sido actualizada correctamente!"}, status=status.HTTP_200_OK)

        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({"error": "El enlace está corrupto o es inválido."}, status=status.HTTP_400_BAD_REQUEST)