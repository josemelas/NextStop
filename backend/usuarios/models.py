from django.db import models
from django.utils import timezone
from datetime import timedelta


class rol(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    nombre = models.CharField(max_lenght = 100)
    email = models.CharField(max_lenght=150)
    password_hash = models.CharField(max_lenght=60)
    telefono = models.CharField(max_lenght=20)
    idioma_preferido = models.CharField(max_lenght=10, default='es')
    moneda_preferida = models.CharField(max_lenght=10, default='MXN')
    email_verificado = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class Usario_rol(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rol = models.ForeignKey(rol, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('usuario','rol')

class Verificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE,)
    codigo = models.CharField(max_lenght=4)
    token = models.CharField(max_lenght=100)
    expiracion = models.DateTimeField()
    usado = models.BooleanField(default=False)

    def expirado(self):
        return timezone.now() > self.expiracion or self.usado
    def __str__(self):
        return f"Verificacion de {self.usuario.email}"

class Sesion (models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ip_origen = models.CharField(max_lenght=45)
    user_agent = models.CharField(max_lenght=255)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField(null=True)
    fecha_expiracion = models.DateTimeField(blank=True, null=True)
    activo = models.BooleanField(default=True)

def default_expiration():
    return timezone.now() + timedelta(minutes=1)