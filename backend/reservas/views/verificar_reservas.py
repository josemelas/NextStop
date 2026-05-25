from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from vuelos.models import Vuelo
from reservas.models import Reserva


class ObtenerAsientosOcupados(APIView):
    permission_classes = [AllowAny]
    def get(self, request, api_id_vuelo):
        reservas = Reserva.objects.filter(
            id_vuelo__api_id=api_id_vuelo,
            estado_pago='PAGADO'
        )
        asientos_ocupados = []
        for reserva in reservas:
            if reserva.asiento_asignado:
                lista_asientos = [asiento.strip() for asiento in reserva.asiento_asignado.split(',')]
                asientos_ocupados.extend(lista_asientos)
        return Response({
            "vuelo_id": api_id_vuelo,
            "asientos_ocupados": asientos_ocupados
        })