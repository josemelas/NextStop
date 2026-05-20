from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from vuelos.models import Vuelo
from reservas.models import Reserva  # Asegúrate de importar el modelo


class Estadisticas(APIView):
    def get(self, request):
        id_proveedor = request.query_params.get('id_proveedor')
        if not id_proveedor:
            return Response({"error": "Se requiere el id_proveedor para cargar las estadísticas"}, status=400)
        try:
            vuelos_empresa = Vuelo.objects.filter(id_proveedor=id_proveedor)
            reservas = Reserva.objects.filter(id_vuelo__in=vuelos_empresa, estado_pago='PAGADO')
            total_ingresos = reservas.aggregate(Sum('monto_total'))['monto_total__sum'] or 0
            total_boletos = reservas.aggregate(Sum('cantidad_pasajeros'))['cantidad_pasajeros__sum'] or 0
            vuelos_activos = vuelos_empresa.count()
            ventas_recientes = reservas.order_by('-fecha_transaccion')[:5]
            lista_ventas = []

            for venta in ventas_recientes:
                lista_ventas.append({
                    "codigo_reserva": venta.codigo_confirmacion,
                    "fecha": venta.fecha_transaccion.strftime("%d/%m/%Y %H:%M"),
                    "monto": str(venta.monto_total),
                    "ruta": f"{venta.id_vuelo.origen} ✈️ {venta.id_vuelo.destino}",
                    "pasajeros": venta.cantidad_pasajeros
                })

            return Response({
                "metricas": {
                    "ingresos_totales_mxn": float(total_ingresos),
                    "boletos_vendidos": total_boletos,
                    "vuelos_publicados": vuelos_activos
                },
                "ventas_recientes": lista_ventas
            }, status=200)

        except Exception as e:
            print(f"Error en estadísticas: {str(e)}")
            return Response({"error": f"Error interno: {str(e)}"}, status=500)