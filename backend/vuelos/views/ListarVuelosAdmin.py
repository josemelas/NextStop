from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from apis_externas.models import Aeropuertos

class ListarVuelosAdmin(APIView):
    permission_classes = []
    def get(self, request):
        vuelos = Vuelo.objects.all().order_by('-id')
        codigos_iata = set()
        for v in vuelos:
            if v.origen: codigos_iata.add(v.origen)
            if v.destino: codigos_iata.add(v.destino)

        info_aeropuertos = {
            a.codigo: f"{a.ciudad}, {a.pais}"
            for a in Aeropuertos.objects.filter(codigo__in=list(codigos_iata))
        }
        lista_vuelos_admin = []
        for v in vuelos:
            origen_completo = info_aeropuertos.get(v.origen, v.origen)
            destino_completo = info_aeropuertos.get(v.destino, v.destino)
            fecha_formateada = v.fecha_salida.strftime('%d %b, %Y') if v.fecha_salida else "Sin fecha"
            lista_vuelos_admin.append({
                "id_vuelo": v.api_id,
                "aerolinea": v.aerolinea,
                "origen_completo": origen_completo,
                "destino_completo": destino_completo,
                "precio_base": float(v.precio_base) if hasattr(v, 'precio_base') and v.precio_base else 0.0,
                "fecha_salida": fecha_formateada,
                "estado_vuelo": getattr(v, 'estado_vuelo', 'A Tiempo')
            })

        return Response(lista_vuelos_admin, status=status.HTTP_200_OK)