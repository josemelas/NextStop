from django.urls import path
from .views.Registrar import RegistrarUsuario, RegistrarEmpresa
from .views.Verificacion import VerificacionCorreo, VerificarLink, ReenviarVerificacion
from .views.Login import LoginUsuario
from rest_framework_simplejwt.views import TokenRefreshView
from .views.ValidarToken import ValidarTokenView
from .views.EditarPerfil import EditarPerfil
from .views.GestionarUsuarios import GestionUsuariosAdminView
from .views.PanelAdmin import EstadisticasDashboard
from .views.PanelProveedor import DashboardProveedor
from .views.EnvioContacto import EnviarMensajeContacto
from.views.RestablecerContraseña import SolicitarRestablecimientoPassword, ConfirmarRestablecimientoPassword

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
    path('restablecer/contraseña/', SolicitarRestablecimientoPassword.as_view(), name='solicitar_restablecimiento_password'),
    path('password/confirmar/', ConfirmarRestablecimientoPassword.as_view(), name='confirmar_password'),
]
