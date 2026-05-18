from django.urls import path
from .views.reservas import CrearReserva

urlpatterns = [
    path('crearreservas/', CrearReserva.as_view(), name='crear_reserva'),
]