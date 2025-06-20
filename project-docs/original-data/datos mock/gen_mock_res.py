import random
import csv

# Listas de nombres y apellidos base
nombres = ["Laura", "Carlos", "Ana", "Miguel", "Lucía", "Pedro", "María", "Javier"]
apellidos = ["García", "López", "Martínez", "Sánchez", "Ramírez", "Torres", "Vega", "Díaz"]
departamentos = ["V103", "V104", "V105", "V110", "V112", "V118", "V121", "V122", "V123"]

# Crear archivo CSV
with open('datos_personas.csv', 'w', newline='') as archivo:
    writer = csv.writer(archivo)
    writer.writerow(['DNI', 'APE1', 'APE2', 'NOMBRE', 'DEPTO'])

    for i in range(1, 101):
        dni = f"{i:08d}A"
        # Nos aseguramos de que no se repitan nombre y apellidos exactamente igual
        while True:
            ape1 = random.choice(apellidos)
            ape2 = random.choice(apellidos)
            nombre = random.choice(nombres)
            if not (ape1 == ape2 == nombre):
                break
        depto = random.choice(departamentos)
        writer.writerow([dni, ape1, ape2, nombre, depto])
