from django.db import models
from usuarios.models import Usuario

class Proveedorapi(models.Model):
    id_proveedor = models.AutoField(primary_key=True, db_column='id_proveedor')
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=1)

    class Meta:
        db_table = 'proveedor_api'
        managed = False
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
    asientos_ocupados = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'vuelo'
        managed = False
    def __str__(self):
        return (f"{self.aereolinea} - {self.codigo_vuelo} - {self.origen} - {self.destino} - {self.fecha_salida} - {self.fehca_llegada} - {self.precio_base} - "
                f"{self.asientos_disponibles} - {self.creado_en}-" f"{self.asientos_ocupados}")