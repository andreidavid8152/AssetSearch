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

