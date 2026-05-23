from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Reserva
from apis_externas.models import Aeropuertos

class ListarReservas(APIView):
    def get(self, request):
        id_usuario = request.query_params.get('usuario_id')

        if not id_usuario:
            return Response({"error": "Se requiere el usuario_id para consultar las reservas"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            reservas = Reserva.objects.filter(id_usuario_id=id_usuario).order_by('-fecha_transaccion')
            codigos_aeropuertos = set()
            for r in reservas:
                if r.id_vuelo:
                    if r.id_vuelo.origen:
                        codigos_aeropuertos.add(r.id_vuelo.origen)
                    if r.id_vuelo.destino:
                        codigos_aeropuertos.add(r.id_vuelo.destino)
            mapa_aeropuertos = {}
            if codigos_aeropuertos:
                mapa_aeropuertos = {
                    a.codigo: f"{a.ciudad}, {a.pais}"
                    for a in Aeropuertos.objects.filter(codigo__in=list(codigos_aeropuertos))
                }
            lista_reservas = []
            for r in reservas:
                vuelo = r.id_vuelo
                fecha_compra_str = r.fecha_transaccion.strftime("%d/%m/%Y %H:%M") if r.fecha_transaccion else "Fecha no disponible"
                fecha_salida_str = vuelo.fecha_salida.strftime("%Y-%m-%dT%H:%M:%S") if vuelo.fecha_salida else ""
                fecha_llegada_str = vuelo.fecha_llegada.strftime("%Y-%m-%dT%H:%M:%S") if vuelo.fecha_llegada else ""
                info_origen = mapa_aeropuertos.get(vuelo.origen, "")
                origen_completo = f"{vuelo.origen} - {info_origen}" if info_origen else vuelo.origen
                info_destino = mapa_aeropuertos.get(vuelo.destino, "")
                destino_completo = f"{vuelo.destino} - {info_destino}" if info_destino else vuelo.destino
                lista_reservas.append({
                    "id_reserva": r.id_reserva,
                    "codigo_confirmacion": r.codigo_confirmacion,
                    "fecha_compra": fecha_compra_str,
                    "monto_total": str(r.monto_total),
                    "estado_pago": r.estado_pago,
                    "cantidad_pasajeros": r.cantidad_pasajeros,
                    "asiento_asignado": r.asiento_asignado,
                    "vuelo": {
                        "api_id": vuelo.api_id,
                        "aerolinea": vuelo.aerolinea,
                        "codigo_vuelo": vuelo.codigo_vuelo,
                        "origen": origen_completo,
                        "destino": destino_completo,
                        "fecha_salida": fecha_salida_str,
                        "fecha_llegada": fecha_llegada_str
                    }
                })
            return Response(lista_reservas, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error al listar reservas del usuario: {str(e)}")
            return Response({"error": f"Error interno en el servidor: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)