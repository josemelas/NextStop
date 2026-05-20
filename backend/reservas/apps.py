from django.apps import AppConfig
import os

class ReservasConfig(AppConfig):
    name = 'reservas'
    path = os.path.dirname(os.path.abspath(__file__))