from django.db import models
from usuarios.models import Usuario

class Favorito(models.Model):
    TIPO_RECURSO_CHOICES = [
        ('VUELO', 'Vuelo'),
        ('PAIS', 'País'),
        ('DESTINO', 'Destino'),
    ]
    id_favorito = models.BigAutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='id_usuario'
    )
    tipo_recurso = models.CharField(
        max_length=10,
        choices=TIPO_RECURSO_CHOICES
    )
    id_recurso = models.CharField(max_length=100)
    fecha_agregado = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'favorito'
        unique_together = ('id_usuario', 'tipo_recurso', 'id_recurso')

    def __str__(self):
        return f"Favorito {self.tipo_recurso} ({self.id_recurso}) - Usuario {self.id_usuario_id}"