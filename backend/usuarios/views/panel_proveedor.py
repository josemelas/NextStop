from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Count
from vuelos.models import Vuelo, Proveedorapi
from reservas.models import Reserva


class DashboardProveedor(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_proveedor = request.query_params.get('id_proveedor')

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

        reservas_agencia = Reserva.objects.filter(id_vuelo__in=vuelos_agencia, estado_pago='PAGADO')

        vuelos_activos = vuelos_agencia.count()
        total_reservas = reservas_agencia.count()
        ingresos_totales = reservas_agencia.aggregate(total=Sum('monto_total'))['total'] or 0
        visitas_perfil = 1428

        vuelos_recientes_query = vuelos_agencia.order_by('-id_vuelo')[:5]  # 💻 Usamos id_vuelo como corregimos antes
        vuelos_recientes_list = []

        for v in vuelos_recientes_query:
            vuelos_recientes_list.append({
                "destino": v.destino,
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

        top_destinos = []
        for item in destinos_populares:
            if item['id_vuelo__destino']:
                top_destinos.append({
                    "nombre": item['id_vuelo__destino'],
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