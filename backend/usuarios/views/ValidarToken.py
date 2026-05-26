from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from usuarios.models import Usuario


class ValidarTokenView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"detail": "Token no proporcionado"}, status=401)

        try:
            token_str = auth_header.split(" ")[1]
            token = AccessToken(token_str)
            usuario_id = token['user_id']
        except TokenError:
            return Response({"detail": "Token inválido o expirado"}, status=401)

        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario no encontrado en base de datos"}, status=404)

        return Response({
            "valid": True,
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
            }
        })