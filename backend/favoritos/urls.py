from django.urls import path
from favoritos.views.favoritear import AgregarFavorito
from favoritos.views.listar_favoritos import ListarFavoritos
from favoritos.views.eliminar_favoritos import EliminarFavorito

urlpatterns = [
    path('favoritosa/agregar/', AgregarFavorito.as_view(), name='crear_favoritos'),
    path('favoritos/listar/', ListarFavoritos.as_view(), name='listar_favoritos'),
    path('favoritos/eliminar/', EliminarFavorito.as_view(), name='eliminar_favoritos'),
]