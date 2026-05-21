from django.db import models


class Reserva(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, db_column='id_usuario')
    id_vuelo = models.ForeignKey('vuelos.Vuelo', on_delete=models.CASCADE, db_column='id_vuelo')
    codigo_confirmacion = models.CharField(max_length=20)
    fecha_transaccion = models.DateTimeField()
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    PENDIENTE = 'PENDIENTE'
    PAGADO = 'PAGADO'
    CANCELADO = 'CANCELADO'
    ESTADO_OPCIONAL = [
        (PENDIENTE, 'Pendiente'),
        (PAGADO, 'Pagado'),
        (CANCELADO, 'Cancelado'),
    ]
    estado_pago = models.CharField(
        max_length=20,
        choices=ESTADO_OPCIONAL,
        default=PENDIENTE,
    )
    cantidad_pasajeros = models.IntegerField(default=1)
    asiento_asignados = models.CharField(max_length=20)

    class Meta:
        db_table = 'reserva'
        managed = False

    def __str__(self):
        return (
            f"{self.Usuario} - {self.Vuelo} - {self.codigo_confirmacion} - {self.fecha_transaccion} - {self.monto_total} - {self.estado_pago} - "
            f"{self.cantidad_pasajeros} - {self.asiento_asignados}")