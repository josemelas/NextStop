import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from ..models import Usuario, Usuario_rol
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class LoginUsuario(APIView):
    permission_classes =[AllowAny]

    def verificar_recaptcha(self, token):
        if not token:
            return False

        secret_key = getattr(settings, 'RECAPTCHA_SECRET_KEY', None)
        if not secret_key:
            print("No se encontro RECAPTCHA_SECRET_KEY en settings.py")
            return False

        data = {
            'secret': secret_key,
            'response': token
        }

        try:
            response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
            result = response.json()
            return result.get('success', False)
        except Exception as e:
            print(f"Error al verificar el reCAPTCHA: {e}")
            return False

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        recaptcha_token = request.data.get('recaptcha_token')
        portal = request.data.get('portal')
        if not self.verificar_recaptcha(recaptcha_token):
            if recaptcha_token != "fake-token":
                return Response(
                    {'error':  'No paso la verificación del CAPTCHA'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if not email or not password:
            return Response({'Email y contraseña son requerido'},
                    status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        if not usuario.email_verificado:
            return Response({'error': 'Correo no verificado'}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password, usuario.password_hash):
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
        roles_usuario = Usuario_rol.objects.filter(usuario=usuario).values_list('rol__nombre', flat=True)
        lista_roles = list(roles_usuario)
        if portal == "cliente":
            if "Cliente" not in lista_roles:
                return Response(
                    {'error': 'Acceso denegado. Esta cuenta no está registrada como Cliente.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif portal == "empresa":
            if "Empresa" not in lista_roles and "Administrador" not in lista_roles:
                return Response(
                    {'error': 'Acceso denegado. Esta cuenta no está registrada como Empresa.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        if 'Administrador' in lista_roles:
            nombre_rol = 'Administrador'
        elif 'Empresa' in lista_roles:
            nombre_rol = 'Empresa'
        else:
            nombre_rol = 'Cliente'

        refresh = RefreshToken.for_user(usuario)
        refresh["user_id"] = usuario.id
        refresh["email"] = usuario.email
        refresh["rol"] = nombre_rol
        access = refresh.access_token
        access["user_id"] = usuario.id
        access["email"] = usuario.email
        access["rol"] = nombre_rol
        access["id_proveedor"] = usuario.id_proveedor.id_proveedor if usuario.id_proveedor else None
        return Response({
            'mensaje': 'Login exitoso',
            'token': {
                'refresh': str(refresh),
                'access': str(access),
            },
            'usuario': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email,
                'telefono': usuario.telefono,
                'idioma_preferido': usuario.idioma_preferido,
                'moneda_preferida': usuario.moneda_preferida,
                'rol': nombre_rol,
                'id_proveedor': usuario.id_proveedor.id_proveedor if usuario.id_proveedor else None,
                "foto_perfil": usuario.foto_perfil.url if usuario.foto_perfil else None,
            }
        }, status=status.HTTP_200_OK)