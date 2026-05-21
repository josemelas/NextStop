from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Reserva

class ListarReservas(APIView):
    def get(self, request):
        id_usuario = request.query_params.get('usuario_id')

        if not id_usuario:
            return Response({"error": "Se requiere el usuario_id para consultar las reservas"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            reservas = Reserva.objects.filter(id_usuario_id=id_usuario).order_by('-fecha_transaccion')

            lista_reservas = []

            for r in reservas:
                vuelo = r.id_vuelo

                lista_reservas.append({
                    "id_reserva": r.id_reserva,
                    "codigo_confirmacion": r.codigo_confirmacion,
                    "fecha_compra": r.fecha_transaccion.strftime("%d/%m/%Y %H:%M"),
                    "monto_total": str(r.monto_total),
                    "estado_pago": r.estado_pago,
                    "cantidad_pasajeros": r.cantidad_pasajeros,
                    "asiento_asignado": r.asiento_asignado,
                    "vuelo": {
                        "api_id": vuelo.api_id,
                        "aerolinea": vuelo.aerolinea,
                        "codigo_vuelo": vuelo.codigo_vuelo,
                        "origen": vuelo.origen,
                        "destino": vuelo.destino,
                        "fecha_salida": vuelo.fecha_salida.strftime("%Y-%m-%dT%H:%M:%S"),
                        "fecha_llegada": vuelo.fecha_llegada.strftime("%Y-%m-%dT%H:%M:%S")
                    }
                })

            return Response(lista_reservas, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error al listar reservas del usuario: {str(e)}")
            return Response({"error": f"Error interno en el servidor: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)