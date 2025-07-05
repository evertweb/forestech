import google.generativeai as genai
import os
from dotenv import load_dotenv # Importa la función para cargar el .env

# --- Cargar variables del archivo .env ---
# Esta línea busca y carga el archivo .env en el directorio actual.
# Debe estar al principio de tu script para que las variables estén disponibles.
load_dotenv()
# ----------------------------------------

# Intenta obtener la clave de API de la variable de entorno
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("Error: La variable de entorno GEMINI_API_KEY no está configurada.")
    print("Asegúrate de tener un archivo .env en el mismo directorio con la línea:")
    print("GEMINI_API_KEY=TU_CLAVE_AQUI")
    exit()

# Configura la API de Gemini con tu clave
genai.configure(api_key=API_KEY)

# Puedes elegir un modelo específico. Gemini 1.5 Flash es una buena opción para el nivel gratuito.
# Revisa la documentación de precios de Gemini para ver los modelos disponibles en el nivel gratuito.
model_name = "gemini 2.5 pro" # Puedes probar con 'gemini-1.5-pro' si tu cuota lo permite
model = genai.GenerativeModel(model_name)

def generate_text(prompt_text):
    """Genera texto usando el modelo Gemini."""
    try:
        # Aquí puedes añadir parámetros adicionales si los necesitas, como generation_config.
        response = model.generate_content(prompt_text)
        print("\n--- Respuesta de Gemini ---")
        print(response.text)
        print("---------------------------\n")
    except Exception as e:
        print(f"Ocurrió un error: {e}")
        print("Posibles causas:")
        print("- La clave de API no es válida.")
        print("- Excediste los límites de uso del nivel gratuito.")
        print("- Problemas de conexión a internet.")
        print("- El modelo seleccionado no está disponible o no soporta la entrada.")

if __name__ == "__main__":
    print("Bienvenido al CLI de Gemini (modo gratuito).")
    print(f"Usando el modelo: {model_name}")
    print("Escribe 'salir' para terminar.")

    while True:
        user_input = input("Tu pregunta o instrucción: ")
        if user_input.lower() == 'salir':
            print("Saliendo...")
            break
        generate_text(user_input)
