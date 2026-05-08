from django.urls import path
from .views.vuelos_views import VuelosView

urlpatterns = [
    path('vuelos/', VuelosView.as_view(), name='buscar_vuelos'),
]
