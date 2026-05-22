from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..models import Usuario, Rol, Usuario_rol
from django.db import transaction

class GestionUsuariosAdminView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def get(self, request):
        usuarios = Usuario.objects.all()
        lista_usuarios = []

        for u in usuarios:
            roles_asignados = Usuario_rol.objects.filter(usuario=u).values_list('rol__nombre', flat=True)

            lista_usuarios.append({
                'id_usuario': u.id,
                'nombre': u.nombre,
                'email': u.email,
                'activo': u.activo,
                'fecha_registro': u.fecha_registro,
                'roles': list(roles_asignados)
            })

        return Response(lista_usuarios, status=status.HTTP_200_OK)

    def put(self, request):
        id_usuario = request.data.get('id_usuario') or request.query_params.get('usuario_id')
        nuevos_roles = request.data.get('roles')

        if not id_usuario or nuevos_roles is None:
            return Response({"error": "Faltan datos (id_usuario o roles)"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(id=id_usuario)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id == usuario.id:
            return Response(
                {"error": "No puedes modificar tus propios roles o perfil."},
                status=status.HTTP_403_FORBIDDEN
            )
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
        id_usuario = request.query_params.get('id_usuario') or request.query_params.get('usuario_id')

        if not id_usuario:
            return Response({"error": "Se requiere el usuario_id para eliminar"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                usuario = Usuario.objects.get(id=id_usuario)
                nombre_usuario = usuario.nombre
                proveedor_vinculado = usuario.id_proveedor

                if proveedor_vinculado:
                    nombre_empresa = proveedor_vinculado.nombre
                    proveedor_vinculado.delete()
                if request.user.id == usuario.id:
                    return Response(
                        {"error": "No puedes eliminar tu propia cuenta."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                with transaction.atomic():
                    usuario.delete()

                mensaje = f"El usuario {nombre_usuario} ha sido eliminado."
                if proveedor_vinculado:
                    mensaje += f" También se eliminó la empresa {nombre_empresa}."

                return Response({"mensaje": mensaje}, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error real en DELETE: {str(e)}")
            return Response({"error": f"Error al eliminar: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)