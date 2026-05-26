from django.urls import path
from .views.GeneradorVuelos import GeneradorVuelos
from .views.ListarVuelosProveedor import ListarVuelos
from .views.EliminarVuelos import EliminarVuelo
from .views.ModificarVuelos import ModificarVuelos
from .views.CrearVuelo import CrearVueloProveedor
from .views.ListarVuelosAdmin import ListarVuelosAdmin
from.views.ActualizarEstadoVuelo import ActualizarEstadoVuelo

urlpatterns = [
    path('vuelos/', GeneradorVuelos.as_view(), name='buscar_vuelos'),
    path('listar/', ListarVuelos.as_view(), name='listar_vuelos'),
    path('eliminar/', EliminarVuelo.as_view(), name='eliminar_vuelo'),
    path('modificar/', ModificarVuelos.as_view(), name='modificar_vuelo'),
    path('crear/', CrearVueloProveedor.as_view(), name='crear_vuelo'),
    path('listar-admin/', ListarVuelosAdmin.as_view(), name='listar_vuelos_admin'),
    path('actualizar-estado/<str:api_id_vuelo>/', ActualizarEstadoVuelo.as_view(), name='actualizar_estado'),
]
