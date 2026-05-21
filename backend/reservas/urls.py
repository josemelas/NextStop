from django.urls import path
from reservas.views.crear_reservas import CrearReserva

urlpatterns = [
    path('crear/', CrearReserva.as_view(), name='crear_reserva'),
]