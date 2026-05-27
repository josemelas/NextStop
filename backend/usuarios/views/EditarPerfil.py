from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from ..models import Usuario, Usuario_rol


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
            return Response({"detail": "Token inválido"}, status=401)

        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario no encontrado"}, status=404)

        data = request.data
        print(f"----> DATOS RECIBIDOS DEL FRONT: {data}")

        nueva_password = data.get('nueva_password')
        password_actual = data.get('password_actual')

        if nueva_password:
            if password_actual:
                if not check_password(password_actual, usuario.password_hash):
                    return Response({"detail": "La contraseña actual es incorrecta."}, status=400)

            usuario.password_hash = make_password(nueva_password)

        if 'nombre' in data:
            usuario.nombre = data.get('nombre')
            if hasattr(usuario, 'id_proveedor') and usuario.id_proveedor:
                usuario.id_proveedor.nombre = data.get('nombre')
                usuario.id_proveedor.save()

        if 'email' in data:
            if Usuario.objects.filter(email=data.get('email')).exclude(id=usuario_id).exists():
                return Response({"detail": "Este correo ya está registrado por otra empresa"}, status=400)
            usuario.email = data.get('email')

        if 'telefono' in data:
            usuario.telefono = data.get('telefono')

        if 'foto' in request.FILES:
            usuario.foto_perfil = request.FILES['foto']

        usuario.save()

        relacion_rol = Usuario_rol.objects.filter(usuario=usuario).first()
        rol_del_usuario = relacion_rol.rol.nombre if relacion_rol else None

        return Response({
            "detail": "Perfil actualizado correctamente",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "telefono": usuario.telefono,
                "foto_perfil": usuario.foto_perfil.url if usuario.foto_perfil else None,
                "rol": rol_del_usuario
            }
        }, status=200)