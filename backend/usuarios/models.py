from django.db import models
from django.utils import timezone
from datetime import timedelta

class Proveedorapi(models.Model):
    id_proveedor = models.AutoField(primary_key=True, db_column='id_proveedor')
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'proveedor_api'
        managed = False

class Rol(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_rol')
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'rol'

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_usuario')
    id_proveedor = models.ForeignKey(
        Proveedorapi,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_proveedor'
    )
    nombre = models.CharField(max_length = 100)
    email = models.CharField(max_length=150)
    password_hash = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    idioma_preferido = models.CharField(max_length=10, default='es')
    moneda_preferida = models.CharField(max_length=10, default='MXN')
    email_verificado = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'usuario'

    def __str__(self):
        return self.nombre

class Usuario_rol(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_usuario_rol')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, db_column='id_rol')

    class Meta:
        managed = False
        db_table = 'usuario_rol'
        unique_together = ('usuario', 'rol')

class Verificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE,)
    codigo = models.CharField(max_length=4)
    token = models.CharField(max_length=100)
    expiracion = models.DateTimeField()
    usado = models.BooleanField(default=False)

    def expirado(self):
        return timezone.now() > self.expiracion or self.usado
    class Meta:
        managed = False
        db_table = 'verificacion'
    def __str__(self):
        return f"Verificacion de {self.usuario.email}"

class Sesion (models.Model):
    id = models.AutoField(primary_key=True, db_column='id_sesion')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    ip_origen = models.CharField(max_length=45)
    user_agent = models.CharField(max_length=255)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField(null=True)
    fecha_expiracion = models.DateTimeField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'sesion'
        managed = False

def default_expiration():
    return timezone.now() + timedelta(minutes=1)