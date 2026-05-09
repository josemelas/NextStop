from django.db import models

class Aeropuertos(models.Model):
    codigo = models.CharField(max_length=3)
    nombre = models.CharField(max_length=150)
    ciudad = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'aeropuertos'
