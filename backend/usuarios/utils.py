import requests
from django.conf import settings

def verificar_recaptcha(response):
     secret_key = settings.RECAPTCHA_SECRET_KEY
     data ={
         'secret': secret_key,
         'response': response
     }
     response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
     result = response.json()
     return result.get('success', False)