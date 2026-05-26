from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
import random
from datetime import datetime, date
from django.utils.timezone import make_aware
from vuelos.models import Vuelo, Proveedorapi
from reservas.models import Reserva
from apis_externas.models import Aeropuertos


class GeneradorVuelos(APIView):
    MAPA_CONTINENTES = {
        # América
        "México": "América", "Estados Unidos": "América", "Canadá": "América",
        "Colombia": "América", "Argentina": "América", "Brasil": "América", "Perú": "América",
        "Chile": "América", "Ecuador": "América", "Panamá": "América", "Costa Rica": "América",
        "El Salvador": "América", "Guatemala": "América", "Cuba": "América", "República Dominicana": "América",
        "Puerto Rico": "América", "Venezuela": "América",
        # Europa
        "España": "Europa", "Francia": "Europa", "Italia": "Europa", "Portugal": "Europa", "Irlanda": "Europa",
        "Reino Unido": "Europa", "Alemania": "Europa", "Países Bajos": "Europa", "Suiza": "Europa",
        "Austria": "Europa", "Dinamarca": "Europa", "Suecia": "Europa", "Grecia": "Europa", "Turquía": "Europa",
        # Asia
        "Japón": "Asia", "China": "Asia", "Corea del Sur": "Asia", "India": "Asia", "Singapur": "Asia",
        "Tailandia": "Asia", "Malasia": "Asia", "Indonesia": "Asia",
        # Medio Oriente
        "Emiratos Árabes Unidos": "Medio Oriente", "Qatar": "Medio Oriente", "Israel": "Medio Oriente",
        # África
        "Egipto": "África", "Sudáfrica": "África", "Marruecos": "África",
        # Oceanía
        "Australia": "Oceanía", "Nueva Zelanda": "Oceanía", "Fiyi": "Oceanía"
    }

    def get(self, request):
        origen = request.query_params.get("origen")
        destino = request.query_params.get("destino")
        fecha_salida_str = request.query_params.get("fecha_salida")

        if not all([origen, destino, fecha_salida_str]):
            return Response({"error": "Faltan parámetros"}, status=400)

        aeropuertos_consulta = Aeropuertos.objects.filter(codigo__in=[origen, destino])
        mapa_paises = {a.codigo: a.pais for a in aeropuertos_consulta}
        pais_origen = mapa_paises.get(origen, "")
        pais_destino = mapa_paises.get(destino, "")
        continente_origen = self.MAPA_CONTINENTES.get(pais_origen, "Desconocido")
        continente_destino = self.MAPA_CONTINENTES.get(pais_destino, "Desconocido")

        es_nacional = False
        es_continental = False
        es_transcontinental = False

        if pais_origen and pais_destino:
            if pais_origen == pais_destino:
                es_nacional = True
            elif continente_origen == continente_destino and continente_origen != "Desconocido":
                es_continental = True
            else:
                es_transcontinental = True
        else:
            es_nacional = True

        if es_nacional:
            multiplicador_distancia = 1.0
            horas_adicionales = 0
        elif es_continental:
            multiplicador_distancia = 1.6
            horas_adicionales = random.randint(2, 4)
        elif es_transcontinental:
            multiplicador_distancia = 3.5
            horas_adicionales = random.randint(8, 14)

        fecha_vuelo = datetime.strptime(fecha_salida_str, "%Y-%m-%d").date()
        dias_antelacion = (fecha_vuelo - date.today()).days
        multiplicador_tiempo = 1.5 if dias_antelacion < 7 else (0.9 if dias_antelacion > 30 else 1.0)

        vuelos_bd = Vuelo.objects.filter(origen=origen, destino=destino, fecha_salida__date=fecha_vuelo)
        if vuelos_bd.exists():
            return self.enviar_formato_frontend(vuelos_bd)

        proveedores = Proveedorapi.objects.filter(activo=True)

        if not proveedores.exists():
            return Response({"error": "No hay aerolíneas registradas para generar vuelos"}, status=404)

        nuevos_vuelos = []

        for prov in proveedores:
            hora_salida_random = random.randint(5, 22)
            duracion_base = random.randint(2, 4)

            total_horas = duracion_base + horas_adicionales
            hora_llegada_int = (hora_salida_random + total_horas) % 24

            obj_salida = datetime.strptime(f"{fecha_salida_str} {hora_salida_random:02d}:00:00", "%Y-%m-%d %H:%M:%S")
            obj_llegada = datetime.strptime(f"{fecha_salida_str} {hora_llegada_int:02d}:00:00", "%Y-%m-%d %H:%M:%S")

            precio_simulado = random.choice([1500, 2200, 3000, 4500])
            precio_final = (precio_simulado * multiplicador_distancia * multiplicador_tiempo) + random.randint(-200,600)

            todos_los_asientos = [f"{fila}{letra}" for fila in range(1, 10) for letra in ['A', 'B', 'C', 'D', 'E', 'F']]
            cantidad_fantasmas = random.randint(8, 22)
            asientos_fantasma = random.sample(todos_los_asientos, cantidad_fantasmas)
            asientos_fantasma_str = ", ".join(asientos_fantasma)
            asientos_disponibles_reales = 54 - cantidad_fantasmas

            vuelo_creado = Vuelo.objects.create(
                id_proveedor=prov,
                api_id=uuid.uuid4().hex,
                aerolinea=prov.nombre,
                codigo_vuelo=f"{prov.nombre[:2].upper()}-{uuid.uuid4().hex[:4].upper()}",
                origen=origen,
                destino=destino,
                fecha_salida=make_aware(obj_salida),
                fecha_llegada=make_aware(obj_llegada),
                precio_base=round(precio_final, 2),
                asientos_disponibles=asientos_disponibles_reales,
                asientos_ocupados=asientos_fantasma_str
            )
            nuevos_vuelos.append(vuelo_creado)

        return self.enviar_formato_frontend(nuevos_vuelos)

    def enviar_formato_frontend(self, vuelos):
        respuesta = []
        for v in vuelos:
            lista_asientos_ocupados = []

            if hasattr(v, 'asientos_ocupados') and v.asientos_ocupados:
                fantasmas = [a.strip() for a in v.asientos_ocupados.split(',')]
                lista_asientos_ocupados.extend(fantasmas)

            reservas_del_vuelo = Reserva.objects.filter(id_vuelo=v, estado_pago='PAGADO')
            for r in reservas_del_vuelo:
                if r.asiento_asignado:
                    asientos = [asiento.strip() for asiento in r.asiento_asignado.split(',')]
                    lista_asientos_ocupados.extend(asientos)

            at_salida = v.fecha_salida.strftime("%Y-%m-%dT%H:%M:%S") if hasattr(v.fecha_salida, 'strftime') else str(
                v.fecha_salida).replace(" ", "T")
            at_llegada = v.fecha_llegada.strftime("%Y-%m-%dT%H:%M:%S") if hasattr(v.fecha_llegada, 'strftime') else str(
                v.fecha_llegada).replace(" ", "T")

            respuesta.append({
                "id": v.api_id,
                "numberOfBookableSeats": v.asientos_disponibles,
                "occupiedSeats": lista_asientos_ocupados,
                "itineraries": [
                    {
                        "segments": [
                            {
                                "carrierCode": v.codigo_vuelo.split("-")[0],
                                "departure": {
                                    "iataCode": v.origen,
                                    "at": at_salida
                                },
                                "arrival": {
                                    "iataCode": v.destino,
                                    "at": at_llegada
                                }
                            }
                        ]
                    }
                ],
                "price": {
                    "total": str(v.precio_base),
                    "currency": "MXN"
                }
            })
        return Response(respuesta, status=200)