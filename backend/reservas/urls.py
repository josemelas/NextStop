from django.urls import path
from reservas.views.crear_reservas import CrearReserva
from reservas.views.listar_reservas import ListarReservas
from reservas.views.verificar_reservas import ObtenerAsientosOcupados

urlpatterns = [
    path('crear/', CrearReserva.as_view(), name='crear_reserva'),
    path('listar/', ListarReservas.as_view(), name='listar_reservas_usuario'),
    path('verificar/', ObtenerAsientosOcupados.as_view(), name='obtener_asientos_ocupados'),
]