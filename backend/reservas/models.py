from django.db import models


class Reserva(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, db_column='id_usuario')
    id_vuelo = models.ForeignKey('vuelos.Vuelo', on_delete=models.CASCADE, db_column='id_vuelo')
    codigo_confirmacion = models.CharField(max_length=50, unique=True)
    fecha_transaccion = models.DateTimeField(auto_now_add=True)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    estado_pago = models.CharField(max_length=20, default='PAGADO')  # O PENDIENTE
    cantidad_pasajeros = models.IntegerField(default=1)
    asiento_asignado = models.CharField(max_length=10, null=True, blank=True)

    class Meta:
        db_table = 'reserva'
        managed = False