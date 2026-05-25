from django.urls import path
from .views.view_registrar import RegistrarUsuario, RegistrarEmpresa
from .views.view_verificar import VerificacionCorreo, VerificarLink, ReenviarVerificacion
from .views.view_login import LoginUsuario
from rest_framework_simplejwt.views import TokenRefreshView
from .views.validartoken_view import ValidarTokenView
from .views.view_editarperfil import EditarPerfil
from .views.gestionar_usuarios import GestionUsuariosAdminView
from .views.panel_admin import EstadisticasDashboard
from .views.panel_proveedor import DashboardProveedor
from .views.contacto_view import EnviarMensajeContacto

urlpatterns = [
    path('registrar/', RegistrarUsuario.as_view(), name='registrar_usuario'),
    path('registrarEmpresa/', RegistrarEmpresa.as_view(), name='registrar_empresa'),
    path('verificar/', VerificacionCorreo.as_view(), name='verificar_correo'),
    path('verificar-link/<str:token>/', VerificarLink.as_view(), name='verificar_link'),
    path('reenviar-codigo/', ReenviarVerificacion.as_view(), name='reenviar_codigo'),
    path('login/', LoginUsuario.as_view(), name='login_usuario'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("validar-token/", ValidarTokenView.as_view(), name="validar_token"),
    path('editar/', EditarPerfil.as_view(), name='editar_perfil'),
    path('admin/gestion/',GestionUsuariosAdminView.as_view(), name='gestion_admin'),
    path('admin/dashboard/', EstadisticasDashboard.as_view(), name='admin_dashboard'),
    path('proveedor/dashboard/', DashboardProveedor.as_view(), name='proveedor_dashboard'),
    path('contacto/', EnviarMensajeContacto.as_view(), name='enviar_mensaje_contacto'),
]
