from django.urls import path
from .views.vuelos_views import GeneradorVuelos
from .views.listar_vuelos import ListarVuelos
from .views.eliminar_vuelos import EliminarVuelo
from .views.modificar_vuelos import ModificarVuelos
from .views.crear_vuelo import CrearVueloProveedor
from .views.ListarVuelosAdmin import ListarVuelosAdmin

urlpatterns = [
    path('vuelos/', GeneradorVuelos.as_view(), name='buscar_vuelos'),
    path('listar/', ListarVuelos.as_view(), name='listar_vuelos'),
    path('eliminar/', EliminarVuelo.as_view(), name='eliminar_vuelo'),
    path('modificar/', ModificarVuelos.as_view(), name='modificar_vuelo'),
    path('crear/', CrearVueloProveedor.as_view(), name='crear_vuelo'),
    path('listar-admin/', ListarVuelosAdmin.as_view(), name='listar_vuelos_admin'),
]
