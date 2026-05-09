from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from apis_externas.models import Aeropuertos


class BuscarUbicaciones(APIView):
    """
    Autocompletado de ubicaciones.
    Busca coincidencias en código, ciudad, país o nombre.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("query", "").strip()

        if len(query) < 2:
            return Response({"error": "Ingresa al menos 2 letras para buscar."}, status=400)

        aeropuertos = Aeropuertos.objects.filter(
            Q(nombre__icontains=query) |
            Q(codigo__icontains=query) |
            Q(ciudad__icontains=query) |
            Q(pais__icontains=query)
        )[:10]

        resultados = []

        for aero in aeropuertos:
            label = f"{aero.ciudad} ({aero.nombre}, {aero.pais})"

            resultados.append({
                "nombre": label,
                "codigo": aero.codigo,
                "tipo": "AIRPORT"
            })

        if not resultados:
            return Response([{"nombre": "No se encontraron aeropuertos", "codigo": "", "tipo": "NONE"}], status=200)

        return Response(resultados, status=200)