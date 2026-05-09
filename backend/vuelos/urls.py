from django.urls import path
from .views.vuelos_views import GeneradorVuelos

urlpatterns = [
    path('vuelos/', GeneradorVuelos.as_view(), name='buscar_vuelos'),
]
