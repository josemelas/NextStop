from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..models import Usuario, Rol, Usuario_rol


class GestionUsuariosAdminView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        usuarios = Usuario.objects.all()
        lista_usuarios = []

        for u in usuarios:
            roles_asignados = Usuario_rol.objects.filter(usuario=u).values_list('rol__nombre', flat=True)

            lista_usuarios.append({
                'id': u.id,
                'nombre': u.nombre,
                'email': u.email,
                'activo': u.activo,
                'fecha_registro': u.fecha_registro,
                'roles': list(roles_asignados)
            })

        return Response(lista_usuarios, status=status.HTTP_200_OK)

    def put(self, request):
        usuario_id = request.data.get('usuario_id')
        nuevos_roles = request.data.get('roles')

        if not usuario_id or nuevos_roles is None:
            return Response({"error": "Faltan datos (usuario_id o roles)"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        Usuario_rol.objects.filter(usuario=usuario).delete()

        roles_agregados = []
        for nombre_rol in nuevos_roles:
            try:
                rol_obj = Rol.objects.get(nombre=nombre_rol)
                Usuario_rol.objects.create(usuario=usuario, rol=rol_obj)
                roles_agregados.append(nombre_rol)
            except Rol.DoesNotExist:
                print(f"Advertencia: El rol '{nombre_rol}' no existe en la BD.")

        return Response({
            "mensaje": f"Roles actualizados con éxito para {usuario.nombre}",
            "roles_actuales": roles_agregados
        }, status=status.HTTP_200_OK)

    def delete(self, request):
        usuario_id = request.query_params.get('usuario_id')

        if not usuario_id:
            return Response({"error": "Se requiere el usuario_id para eliminar"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(id=usuario_id)
            nombre = usuario.nombre
            usuario.delete()
            return Response({"mensaje": f"El usuario {nombre} ha sido eliminado del sistema."},
                            status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)