from django.urls import path
from vuelos.views.vuelos_views import GeneradorVuelos
from .views.buscar_lugares import BuscarUbicaciones

urlpatterns = [
    path('vuelos/', GeneradorVuelos.as_view(), name='api_vuelos'),
    path("locations/", BuscarUbicaciones.as_view(), name="buscar_ubicaciones"),
]
