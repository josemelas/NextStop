from django.urls import path
from vuelos.views.GeneradorVuelos import GeneradorVuelos
from .views.BuscarLugares import BuscarUbicaciones

urlpatterns = [
    path('vuelos/', GeneradorVuelos.as_view(), name='api_vuelos'),
    path("locations/", BuscarUbicaciones.as_view(), name="buscar_ubicaciones"),
]
