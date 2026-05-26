from django.urls import path
from reservas.views.CrearReservas import CrearReserva
from reservas.views.ListarReservas import ListarReservas
from reservas.views.VerificarReservas import ObtenerAsientosOcupados

urlpatterns = [
    path('crear/', CrearReserva.as_view(), name='crear_reserva'),
    path('listar/', ListarReservas.as_view(), name='listar_reservas_usuario'),
    path('verificar/<str:api_id_vuelo>/', ObtenerAsientosOcupados.as_view(), name='asientos_ocupados'),
]