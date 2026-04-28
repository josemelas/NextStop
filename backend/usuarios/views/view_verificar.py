from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from django.db.models import Model
from ..models import Usuario, Verificacion
import random, uuid
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import redirect

class VerificacionCorreo(APIView):
    permission_classes =[AllowAny]

    def post(self, request):
        email = request.data.get('email')
        codigo = request.data.get('codigo')
        token = request.data.get('token')

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if token:
                verificacion = Verificacion.objects.get(usuario=usuario, token=token)
            else:
                verificacion = Verificacion.objects.get(usuario=usuario, codigo=codigo)
        except Verificacion.DoesNotExist:
            return Response({'error', 'Codigo o token invalido'}), status.HTTP_400_BAD_REQUEST

        if verificacion.expirado():
            return Response({'error': 'El Codigo ha expirado'}, status=status.HTTP_400_BAD_REQUEST)

        usuario.email_verificado = True
        usuario.save()

        verificacion.usado = True
        verificacion.save()

        return Response({'mensaje': 'Correo verificado correctamente'}, status=status.HTTP_200_OK)

class ReenviarVerificacion(APIView):
    permission_classes =[AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        if usuario.email_verificado:
            return Response({'error': 'El correo ya ha sido verificado'}, status=status.HTTP_400_BAD_REQUEST)

        Verificacion.objects.filter(usuario=usuario, usado=False.update(usado=True))

        codigo = random.randint(1000, 9999)
        token = str(uuid.uuid4())

        Verificacion.objects.create(
            usuario=usuario,
            codigo=str(codigo),
            token=token,
        )

        link_verificacion = f'http://localhost:8000/api/usuarios/verificar/{token}'
        tiempo = 1

        mensaje = f"""
        ✉Asunto: Verifica tu cuenta en NextStop

        Hola {usuario.nombre},

        Hemos recibido una solicitud para reenviar tu código de verificación.
        Utiliza el siguiente código o haz clic en el enlace para completar la verificación de tu cuenta.

        Código de verificación: {codigo}
        Enlace de verificación: {link_verificacion}

        Por motivos de seguridad, este código y enlace expirarán en {tiempo} minuto.
        """

        send_mail(
            subject='Verifica tu cuenta en NextStop',
            message=mensaje,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            fail_silently=False,
        )

        return Response({'mensaje': 'Se ha reenviado el correo de verificación, Revise su bandeja de entrada.'})

class VerificarLink(APIView):
    permission_classes =[AllowAny]

    def get(self, request, token):
        try:
            verificacion = Verificacion.objects.get(token=token)
        except Verificacion.DoesNotExist:
            return redirect('expirado')
        usuario = verificacion.usuario
        if usuario.email_verificado:
            return redirect('verificado')
        if verificacion.expirado():
            verificacion.usado = True
            verificacion.save()
            return redirect('expirado')

        usuario.email_verificado = True
        usuario.save()
        verificacion.usado = True
        verificacion.save()
        return redirect('verificado')
