from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Count
from vuelos.models import Vuelo, Proveedorapi
from reservas.models import Reserva
from apis_externas.models import Aeropuertos


class DashboardProveedor(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_proveedor = request.query_params.get('id_proveedor')
        mes = request.query_params.get('mes')
        anio = request.query_params.get('anio')
        if not id_proveedor:
            return Response(
                {"error": "Falta el parámetro id_proveedor en la consulta."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            agencia = Proveedorapi.objects.get(id_proveedor=id_proveedor)
        except Proveedorapi.DoesNotExist:
            return Response(
                {"error": "La empresa o agencia especificada no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
        vuelos_agencia = Vuelo.objects.filter(id_proveedor=agencia)
        if anio:
            vuelos_agencia = vuelos_agencia.filter(fecha_salida__year=anio)
        if mes:
            vuelos_agencia = vuelos_agencia.filter(fecha_salida__month=mes)
        reservas_agencia = Reserva.objects.filter(id_vuelo__in=vuelos_agencia, estado_pago='PAGADO')
        vuelos_agencia = Vuelo.objects.filter(id_proveedor=agencia)

        vuelos_activos = vuelos_agencia.count()
        total_reservas = reservas_agencia.count()
        ingresos_totales = reservas_agencia.aggregate(total=Sum('monto_total'))['total'] or 0
        visitas_perfil = 1428

        vuelos_recientes_query = vuelos_agencia.order_by('-id_vuelo')[:5]
        codigos_recientes = [v.destino for v in vuelos_recientes_query if v.destino]
        info_aero_recientes = {}
        if codigos_recientes:
            info_aero_recientes = {
                a.codigo: f"{a.ciudad}, {a.pais}"
                for a in Aeropuertos.objects.filter(codigo__in=codigos_recientes)
            }
        vuelos_recientes_list = []
        for v in vuelos_recientes_query:
            codigo = v.destino
            nombre_destino = info_aero_recientes.get(codigo, codigo) if codigo else "Sin destino"
            vuelos_recientes_list.append({
                "destino": nombre_destino,
                "aerolinea": agencia.nombre,
                "precio": float(v.precio_base) if hasattr(v, 'precio_base') and v.precio_base else 0.0,
                "fecha": v.fecha_salida.strftime('%d %b, %Y') if hasattr(v,'fecha_salida') and v.fecha_salida else "Sin fecha",
                "estado": "Programado"
            })
        destinos_populares = (
            reservas_agencia.values('id_vuelo__destino')
            .annotate(num_reservas=Count('id_reserva'))
            .order_by('-num_reservas')[:3]
        )
        codigos_iata = [d['id_vuelo__destino'] for d in destinos_populares if d['id_vuelo__destino']]
        info_aeropuertos = {
            a.codigo: f"{a.ciudad}, {a.pais}"
            for a in Aeropuertos.objects.filter(codigo__in=codigos_iata)
        }
        top_destinos = []
        for item in destinos_populares:
            codigo = item['id_vuelo__destino']
            if codigo:
                nombre_formateado = info_aeropuertos.get(codigo, codigo)
                top_destinos.append({
                    "nombre": nombre_formateado,
                    "reservas": item['num_reservas']
                })

        return Response({
            "agencia": {
                "id": agencia.id_proveedor,
                "nombre": agencia.nombre
            },
            "kpis": {
                "vuelos_activos": vuelos_activos,
                "total_reservas": total_reservas,
                "ingresos": float(ingresos_totales),
                "visitas": visitas_perfil
            },
            "vuelos_recientes": vuelos_recientes_list,
            "destinos_principales": top_destinos
        }, status=status.HTTP_200_OK)