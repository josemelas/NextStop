from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo, Proveedorapi
from apis_externas.models import Aeropuertos

class ListarVuelos(APIView):
    def get(self, request):
        id_proveedor = request.query_params.get('id_proveedor')
        if not id_proveedor:
            return Response({"error": "Se requiere el id_proveedor"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            agencia = Proveedorapi.objects.get(id_proveedor=id_proveedor)
        except Proveedorapi.DoesNotExist:
            return Response({"error": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        vuelos = Vuelo.objects.filter(id_proveedor=agencia).order_by('-fecha_salida')

        codigos_iata = set()
        for v in vuelos:
            if v.origen: codigos_iata.add(v.origen)
            if v.destino: codigos_iata.add(v.destino)

        mapa_aeropuertos = {}
        if codigos_iata:
            mapa_aeropuertos = {
                a.codigo: f"{a.ciudad}, {a.pais}"
                for a in Aeropuertos.objects.filter(codigo__in=list(codigos_iata))
            }

        lista_vuelos_tabla = []

        for v in vuelos:
            cantidad_bloqueados = 0
            if hasattr(v, 'asientos_ocupados') and v.asientos_ocupados:
                cantidad_bloqueados = len([a for a in v.asientos_ocupados.split(',') if a.strip()])

            asientos_reales_restantes = v.asientos_disponibles - cantidad_bloqueados

            if asientos_reales_restantes < 0:
                asientos_reales_restantes = 0

            if asientos_reales_restantes == 0:
                estado_disponibilidad = "Agotado"
            elif asientos_reales_restantes >= 20:
                estado_disponibilidad = "Limitado"
            else:
                estado_disponibilidad = "Disponible"
            fecha_formateada = "Sin fecha"
            if v.fecha_salida:
                fecha_formateada = v.fecha_salida.strftime("%d %b, %Y")
            nombre_origen = mapa_aeropuertos.get(v.origen, v.origen)
            nombre_destino = mapa_aeropuertos.get(v.destino, v.destino)
            lista_vuelos_tabla.append({
                "api_id": v.api_id,
                "id_vuelo": v.id_vuelo,
                "aerolinea": agencia.nombre,
                "destino_completo": nombre_destino,
                "origen_completo": nombre_origen,
                "precio": float(v.precio_base) if v.precio_base else 0.0,
                "fecha_salida": fecha_formateada,
                "disponibilidad": estado_disponibilidad,
                "asientos_restantes": asientos_reales_restantes,
                "estado_vuelo": getattr(v, 'estado_vuelo', 'A Tiempo')
            })

        return Response(lista_vuelos_tabla, status=status.HTTP_200_OK)