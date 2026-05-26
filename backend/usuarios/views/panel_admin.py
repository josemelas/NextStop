from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from vuelos.models import Vuelo, Proveedorapi
from reservas.models import Reserva


class EstadisticasDashboard(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        mes = request.query_params.get('mes')
        anio = request.query_params.get('anio')
        reservas_query = Reserva.objects.filter(estado_pago='PAGADO')
        vuelos_query = Vuelo.objects.all()

        if mes and anio:
            reservas_query = reservas_query.filter(
                id_vuelo__fecha_salida__year=int(anio),
                id_vuelo__fecha_salida__month=int(mes)
            )
            vuelos_query = vuelos_query.filter(
                fecha_salida__year=int(anio),
                fecha_salida__month=int(mes)
            )

        total_vuelos = vuelos_query.count()
        total_agencias = Proveedorapi.objects.filter(activo=True).count()

        ventas_totales = reservas_query.count()
        ingresos_reales_totales = reservas_query.aggregate(total=Sum('monto_total'))['total'] or 0
        ingresos_fantasmas_totales = 0

        for vuelo in vuelos_query:
            if vuelo.asientos_ocupados:
                cantidad_fantasmas = len([a for a in vuelo.asientos_ocupados.split(',') if a.strip()])
                ingresos_fantasmas_totales += (cantidad_fantasmas * vuelo.precio_base)

        ingresos_totales_combinados = float(ingresos_reales_totales) + float(ingresos_fantasmas_totales)

        agencias = Proveedorapi.objects.all()
        directorio = []

        for agencia in agencias:
            vuelos_agencia = vuelos_query.filter(id_proveedor=agencia)
            reservas_agencia = reservas_query.filter(id_vuelo__in=vuelos_agencia)
            ingresos_reales_agencia = reservas_agencia.aggregate(total=Sum('monto_total'))['total'] or 0
            ingresos_fantasmas_agencia = 0

            for vuelo in vuelos_agencia:
                if vuelo.asientos_ocupados:
                    cantidad_fantasmas = len([a for a in vuelo.asientos_ocupados.split(',') if a.strip()])
                    ingresos_fantasmas_agencia += (cantidad_fantasmas * vuelo.precio_base)

            ingresos_agencia_combinados = float(ingresos_reales_agencia) + float(ingresos_fantasmas_agencia)

            directorio.append({
                "nombre": agencia.nombre,
                "estado": "Activo" if agencia.activo else "Inactivo",
                "vuelos": vuelos_agencia.count(),
                "ingresos": ingresos_agencia_combinados
            })

        directorio_ordenado = sorted(directorio, key=lambda x: x['ingresos'], reverse=True)

        return Response({
            "kpis": {
                "vuelos_totales": total_vuelos,
                "agencias_activas": total_agencias,
                "ventas_mes": ventas_totales,
                "ingresos_mes": ingresos_totales_combinados
            },
            "directorio_agencias": directorio_ordenado[:5],
            "estado_amadeus": "ONLINE"
        }, status=200)