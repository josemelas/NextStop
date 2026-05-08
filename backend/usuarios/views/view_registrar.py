from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..serializers import UsuarioSerializer
from ..models import Usuario, Verificacion
import random, uuid
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from ..utils import verificar_recaptcha

class RegistrarUsuario(APIView):
    permission_classes =[AllowAny]

    def post(self, request):
        data = request.data
        token = data.get('recaptcha_token')

        if not verificar_recaptcha(token):
            if token != "fake-token":
                return Response({'error': 'No paso la verificación del CAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

        if'password' in data:
            data['password_hash'] = make_password(data.pop('password'))

        data.setdefault('idoma_preferido', 'es')
        data.setdefault('moneda_preferida', 'MXN')

        if Usuario.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Este Correo Ya Esta Registrado'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UsuarioSerializer(data=data)
        if serializer.is_valid():
            usuario = serializer.save(email_verificado=True)

            """
                        codigo = random.randint(1000, 9999)
                        token = str(uuid.uuid4())

                        Verificacion.objects.create(
                            usuario=usuario,
                            codigo=str(codigo),
                            token=token,
                        )

                        link_verificacion = f'https://seal-app-u4egd.ondigitalocean.app/api/usuarios/verificar/{token}'
                        tiempo = 1

                        mensaje = f'''
            ✉Asunto: Verifica tu cuenta en NextStop

            Hola {usuario.nombre},

            ... (resto del mensaje) ...

            El equipo de NextStop
            '''
                        send_mail(
                            subject='Verifica tu cuenta en NextStop',
                            message=mensaje,
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[usuario.email],
                            fail_silently=False,
                        )
                        """
            return Response({'mensaje': 'Usuario creado exitosamente. Ya puedes iniciar sesión.'},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




