from django.urls import path
from vuelos.views.vuelos_views import VuelosView
from .views.amadeus_lugares import BuscarUbicacionesView

urlpatterns = [
    path('vuelos/', VuelosView.as_view(), name='api_vuelos'),
    path("locations/", BuscarUbicacionesView.as_view(), name="buscar_ubicaciones"),
]
