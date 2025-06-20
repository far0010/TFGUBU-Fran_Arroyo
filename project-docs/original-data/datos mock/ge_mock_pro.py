import random
import csv
from datetime import datetime, timedelta

# Lista de DNIs posibles (del 00000001A al 00000100A)
dnis = [f"{i:08d}A" for i in range(1, 101)]

# Códigos ORGANICA del ORGA03 al ORGA99
organicas = [f"ORGA{str(i).zfill(2)}" for i in range(3, 100)]

# Fechas posibles de inicio
dias_validos = ["01/01", "01/07", "01/09", "01/11"]
anios_validos = list(range(2020, 2029))  # hasta 2028 incluido

# Función para generar el título
def generar_titulo():
    sufijo = ''.join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=6))
    return f"Proyecto de Investigación - {sufijo}"

# Función para generar fecha fin según fecha inicio y duración
def calcular_fecha_fin(fecha_ini, años_duracion):
    # Si empieza el 01/01, termina el 31/12 X años después
    if fecha_ini.month == 1 and fecha_ini.day == 1:
        return datetime(fecha_ini.year + años_duracion, 12, 31)
    # Si empieza el 01/07, acaba el 30/06
    elif fecha_ini.month == 7:
        return datetime(fecha_ini.year + años_duracion, 6, 30)
    # 01/09 → 31/08
    elif fecha_ini.month == 9:
        return datetime(fecha_ini.year + años_duracion, 8, 31)
    # 01/11 → 31/10
    elif fecha_ini.month == 11:
        return datetime(fecha_ini.year + años_duracion, 10, 31)

# Crear archivo CSV
with open('datos_proyectos_extendido.csv', 'w', newline='') as archivo:
    writer = csv.writer(archivo)
    writer.writerow(['ORGANICA', 'TITULO', 'RESPONSABLE', 'FECHA_INI', 'FECHA_FIN'])

    for organica in organicas:
        titulo = generar_titulo()
        responsable = random.choice(dnis)

        # Elegimos una fecha de inicio válida que no pase del año actual
        while True:
            año = random.choice(anios_validos)
            if año <= datetime.now().year:
                break
        dia_mes = random.choice(dias_validos)
        fecha_ini_str = f"{dia_mes}/{año}"
        fecha_ini = datetime.strptime(fecha_ini_str, "%d/%m/%Y")

        # Calcular fecha fin
        años_duracion = random.choice([1, 2, 3, 4])
        fecha_fin = calcular_fecha_fin(fecha_ini, años_duracion)

        # Escribir la fila
        writer.writerow([
            organica,
            titulo,
            responsable,
            fecha_ini.strftime("%d/%m/%Y"),
            fecha_fin.strftime("%d/%m/%Y")
        ])
