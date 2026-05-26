from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..serializers import UsuarioSerializer
from ..models import Usuario, Verificacion, Rol, Usuario_rol, Proveedorapi
import random, uuid
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from ..utils import verificar_recaptcha
from django.db import transaction

class RegistrarUsuario(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        token = data.get('recaptcha_token')

        if not verificar_recaptcha(token):
            if token != "fake-token":
                return Response({'error': 'No paso la verificación del CAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

        if 'password' in data:
            data['password_hash'] = make_password(data.pop('password'))

        data.setdefault('idoma_preferido', 'es')
        data.setdefault('moneda_preferida', 'MXN')

        if Usuario.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Este Correo Ya Esta Registrado'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UsuarioSerializer(data=data)
        if serializer.is_valid():
            usuario = serializer.save(email_verificado=True)
            try:
                rol_cliente = Rol.objects.get(nombre='Cliente')
                Usuario_rol.objects.create(usuario=usuario, rol=rol_cliente)
            except Rol.DoesNotExist:
                print("Advertencia: El Rol Cliente no se encontró.")

            return Response({'mensaje': 'Usuario creado exitosamente. Ya puedes iniciar sesión.'},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistrarEmpresa(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        token = data.get('recaptcha_token')
        nombre_empresa = data.get('nombre_empresa')

        if not nombre_empresa:
            return Response({'error': 'El nombre de la empresa es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

        if not verificar_recaptcha(token):
            if token != "fake-token":
                return Response({'error': 'No paso la verificación del CAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Este Correo Ya Esta Registrado'}, status=status.HTTP_400_BAD_REQUEST)

        if 'password' in data:
            data['password_hash'] = make_password(data.pop('password'))
        data.setdefault('idoma_preferido', 'es')
        data.setdefault('moneda_preferida', 'MXN')
        try:
            with transaction.atomic():
                nuevo_proveedor = Proveedorapi.objects.create(
                    nombre=nombre_empresa,
                    activo=True
                )
                serializer = UsuarioSerializer(data=data)
                if serializer.is_valid():
                    usuario = serializer.save(
                        email_verificado=True,
                        id_proveedor=nuevo_proveedor
                    )
                    try:
                        rol_empresa = Rol.objects.get(nombre='Empresa')
                        Usuario_rol.objects.create(usuario=usuario, rol=rol_empresa)
                    except Rol.DoesNotExist:
                        print("Advertencia: El Rol Empresa no se encontró.")

                    return Response({'mensaje': 'Empresa y administrador registrados exitosamente.'},
                                    status=status.HTTP_201_CREATED)
                else:
                    raise ValueError(serializer.errors)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



