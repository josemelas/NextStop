from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import requests
from django.conf import settings

class BuscarUbicacionesView(APIView):
    """
    Autocompletado de ubicaciones con plan de contingencia blindado.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("query", "")
        if len(query) < 2:
            return Response({"error": "Ingresa al menos 2 letras para buscar."}, status=400)

        # === FUNCIÓN DE RESCATE (PLAN B) ===
        def usar_rescate(query):
            print("⚠ Activando rescate para ciudades. Mandando datos de emergencia...")
            datos_emergencia = [
                {"nombre": "Madrid (Barajas, Spain)", "codigo": "MAD", "tipo": "AIRPORT"},
                {"nombre": "Mexico City (Benito Juarez, Mexico)", "codigo": "MEX", "tipo": "AIRPORT"},
                {"nombre": "Cancun (Cancun Intl, Mexico)", "codigo": "CUN", "tipo": "AIRPORT"},
                {"nombre": "Veracruz (General Heriberto Jara, Mexico)", "codigo": "VER", "tipo": "AIRPORT"},
                {"nombre": "Guadalajara (Miguel Hidalgo, Mexico)", "codigo": "GDL", "tipo": "AIRPORT"},
                {"nombre": "Bogota (El Dorado, Colombia)", "codigo": "BOG", "tipo": "AIRPORT"}
            ]
            # Filtra la lista para que coincida con lo que escribes
            resultados_filtrados = [
                item for item in datos_emergencia
                if query.lower() in item["nombre"].lower() or query.lower() in item["codigo"].lower()
            ]
            return Response(resultados_filtrados, status=200)

        try:
            # === INTENTO CON AMADEUS ===
            token = self.obtener_token_amadeus()
            if not token:
                return usar_rescate(query)

            url = "https://test.api.amadeus.com/v1/reference-data/locations"
            params = {
                "subType": "CITY,AIRPORT",
                "keyword": query,
                "page[limit]": 10
            }
            headers = {"Authorization": f"Bearer {token}"}

            response = requests.get(url, headers=headers, params=params)

            # Si Amadeus tira error 500 u otro, saltamos al rescate
            if response.status_code != 200:
                return usar_rescate(query)

            data = response.json()

            # Si Amadeus responde bien pero no encuentra nada, saltamos al rescate
            if not data.get("data"):
                return usar_rescate(query)

            # === PROCESAR RESULTADOS REALES ===
            resultados = []
            for item in data.get("data", []):
                nombre = item.get("name")
                codigo = item.get("iataCode")
                tipo = item.get("subType")
                pais = item.get("address", {}).get("countryName", "")
                ciudad = item.get("address", {}).get("cityName", "")

                if tipo == "CITY":
                    label = f"{nombre}, {pais}"
                else:
                    label = f"{nombre} ({ciudad}, {pais})"

                resultados.append({
                    "nombre": label,
                    "codigo": codigo,
                    "tipo": tipo
                })

            return Response(resultados, status=200)

        except Exception as e:
            # Si Python crashea por cualquier motivo, saltamos al rescate
            print(f"Excepción atrapada: {e}")
            return usar_rescate(query)

    def obtener_token_amadeus(self):
        """
        Obtiene un token temporal de Amadeus.
        """
        client_id = getattr(settings, "AMADEUS_API_KEY", None)
        client_secret = getattr(settings, "AMADEUS_API_SECRET", None)

        if not client_id or not client_secret:
            return None

        token_url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        payload = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }

        try:
            response = requests.post(token_url, data=payload)
            if response.status_code == 200:
                return response.json().get("access_token")
            return None
        except:
            return None