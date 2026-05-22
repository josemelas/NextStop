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
        hoy = timezone.now()
        mes_actual = hoy.month
        anio_actual = hoy.year

        total_vuelos = Vuelo.objects.count()
        total_agencias = Proveedorapi.objects.filter(activo=True).count()

        reservas_mes = Reserva.objects.filter(
            fecha_transaccion__year=anio_actual,
            fecha_transaccion__month=mes_actual,
            estado_pago='PAGADO'
        )

        ventas_mes = reservas_mes.count()
        ingresos_mes = reservas_mes.aggregate(total=Sum('monto_total'))['total'] or 0

        agencias = Proveedorapi.objects.all()
        directorio = []

        for agencia in agencias:
            vuelos_agencia = Vuelo.objects.filter(id_proveedor=agencia)

            reservas_agencia = Reserva.objects.filter(id_vuelo__in=vuelos_agencia, estado_pago='PAGADO')
            ingresos_agencia = reservas_agencia.aggregate(total=Sum('monto_total'))['total'] or 0

            directorio.append({
                "nombre": agencia.nombre,
                "estado": "Activo" if agencia.activo else "Inactivo",
                "vuelos": vuelos_agencia.count(),
                "ingresos": float(ingresos_agencia)
            })

        directorio_ordenado = sorted(directorio, key=lambda x: x['ingresos'], reverse=True)

        return Response({
            "kpis": {
                "vuelos_totales": total_vuelos,
                "agencias_activas": total_agencias,
                "ventas_mes": ventas_mes,
                "ingresos_mes": float(ingresos_mes)
            },
            "directorio_agencias": directorio_ordenado[:5],
            "estado_amadeus": "ONLINE"
        }, status=200)