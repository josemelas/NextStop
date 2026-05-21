from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from ..models import Usuario

class EditarPerfil(APIView):
    authentication_classes = []
    permission_classes = []

    def patch(self, request):
        auth_header = request.headers.get('Authorization')
        print(f"----> HEADER RECIBIDO: {auth_header}")
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({"detail": "No autorizado"}, status=401)
        try:
            token_str = auth_header.split(' ')[1]
            token = AccessToken(token_str)
            usuario_id = token['user_id']
        except TokenError:
            return Response({"detail": "Token invalido"}, status=401)

        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario no encontrado"}, status=404)
        data = request.data
        if 'nombre' in data:
            usuario.nombre = data.get('nombre')

        if 'email' in data:
            if Usuario.objects.filter(email=data.get('email')).exclude(id=usuario_id).exists():
                return Response({"detail": "Este correo ya esta registrado"}, status=400)
            usuario.email = data.get('email')

        if 'telefono' in data:
            usuario.telefono = data.get('telefono')

        if 'password' in data:
            usuario.password_hash = make_password(data.get('password'))

        if 'foto' in request.FILES:
            usuario.foto_perfil = request.FILES['foto']

        usuario.save()

        return Response({
            "detail": "Perfil actualizado correctamente",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "telefono": usuario.telefono,
                "foto_perfil": usuario.foto_perfil.url if usuario.foto_perfil else None,
                "is_superuser": usuario.is_superuser
            }
        }, status=200)  