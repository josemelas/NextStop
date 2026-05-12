from django.db import models
from usuarios.models import Usuario

class Proveedorapi(models.Model):
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=1)
    def __str__(self):
        return self.nombre

class Vuelo(models.Model):
    id_vuelo = models.AutoField(primary_key=True)
    id_proveedor = models.ForeignKey('Proveedorapi', on_delete=models.SET_NULL, null=True, db_column='id_proveedor')
    api_id = models.CharField(max_length=100)
    aerolinea = models.CharField(max_length=100)
    codigo_vuelo = models.CharField(max_length=20)
    origen = models.CharField(max_length=10)
    destino = models.CharField(max_length=10)
    fecha_salida = models.DateTimeField()
    fecha_llegada = models.DateTimeField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    asientos_disponibles = models.IntegerField()
    creado_en = models.DateTimeField()

    class Meta:
        db_table = 'vuelo'
        managed = False
    def __str__(self):
        return (f"{self.aereolinea} - {self.codigo_vuelo} - {self.origen} - {self.destino} - {self.fecha_salida} - {self.fehca_llegada} - {self.precio_base} - "
                f"{self.asientos_disponibles} - {self.creado_en}")

class Reserva(models.Model):
    Usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    Vuelo = models.ForeignKey(Vuelo, on_delete=models.CASCADE)
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
        return (f"{self.Usuario} - {self.Vuelo} - {self.codigo_confirmacion} - {self.fecha_transaccion} - {self.monto_total} - {self.estado_pago} - "
                f"{self.cantidad_pasajeros} - {self.asiento_asignados}")