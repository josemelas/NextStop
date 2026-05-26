from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from vuelos.models import Vuelo
from reservas.models import Reserva


class ObtenerAsientosOcupados(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        api_id_vuelo = request.query_params.get('vuelo_id')

        if not api_id_vuelo:
            return Response({"error": "Falta el parámetro vuelo_id"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            vuelo = Vuelo.objects.get(api_id=api_id_vuelo)
            asientos_ocupados = []

            if vuelo.asientos_ocupados_base:
                lista_fantasmas = [a.strip() for a in vuelo.asientos_ocupados_base.split(',')]
                asientos_ocupados.extend(lista_fantasmas)

            reservas = Reserva.objects.filter(id_vuelo=vuelo, estado_pago='PAGADO')
            for reserva in reservas:
                if reserva.asiento_asignado:
                    lista_reales = [a.strip() for a in reserva.asiento_asignado.split(',')]
                    asientos_ocupados.extend(lista_reales)

            return Response({
                "vuelo_id": api_id_vuelo,
                "asientos_ocupados": asientos_ocupados
            })

        except Vuelo.DoesNotExist:
            return Response({"error": "Vuelo no encontrado"}, status=status.HTTP_404_NOT_FOUND)