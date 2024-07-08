import subprocess
import json

def clasificar_urls(json_input):
    # Convertir el JSON de entrada a una cadena JSON
    json_data = json.dumps(json_input)

    # Leer el contenido del archivo g4f_chat.js
    with open('g4f_chat.js', 'r') as file:
        js_code = file.read()

    # Reemplazar el marcador de posición con el JSON de entrada
    js_code = js_code.replace('<PLACEHOLDER_JSON_DATA>', json_data)

    # Escribir el código JavaScript actualizado a un archivo temporal
    with open('g4f_chat_temp.js', 'w') as temp_file:
        temp_file.write(js_code)

    # Ejecutar el archivo JavaScript temporal usando Node.js
    result = subprocess.run(["node", "g4f_chat_temp.js"], capture_output=True, text=True, check=True)

    # Procesar la salida de Node.js
    output = result.stdout.strip()

    # Intentar decodificar la salida de Node.js
    try:
        # Envolver la salida en una lista JSON válida
        output_json = f"[{output}]"
        return json.loads(output_json)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return []

# Función para dividir la lista en lotes de tamaño n
def dividir_en_lotes(data, n):
    for i in range(0, len(data), n):
        yield data[i:i + n]

# Ejemplo de uso de la función
data = [
    {"data": "https://bannerloginnnoprod.udla.edu.ec"},
    {"data": "https://bannerregistronoprod.udla.edu.ec"},
    {"data": "https://bannerwfnoprod.udla.edu.ec"},
    {"data": "https://bannerautoservicionoprod.udla.edu.ec"},
    {"data": "https://udla.edu.ec"},
    {"data": "https://blogs.udla.edu.ec"}
]

# Dividir los datos en lotes de 3 elementos
lotes = dividir_en_lotes(data, 3)

# Almacenar todos los resultados
todos_los_resultados = []

# Procesar cada lote
for lote in lotes:
    resultado = clasificar_urls(lote)
    todos_los_resultados.extend(resultado)

# Convertir todos los resultados a JSON sin escape de caracteres Unicode
result_json = json.dumps(todos_los_resultados, indent=4, ensure_ascii=False)

# Imprimir el JSON resultante
print(result_json)
