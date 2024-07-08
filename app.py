from flask import Flask, request, jsonify
import subprocess
import requests
from flask_cors import CORS
from gpt import clasificar_urls  # Importar la función desde gpt.py

app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda la aplicación

# Configura tus propias claves de API aquí
google_api_key = 'AIzaSyBSt4-7B41fv_rMg60AJXZgV1gthw5DsBc'
google_cx = '2081fc0796d0f4ad2'

def get_subdomains(domain):
    assetfinder_path = r"C:\Users\andre\go\bin\assetfinder.exe"  # Asegúrate de que esta ruta es correcta
    command = f"{assetfinder_path} --subs-only {domain}"
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        subdomains = result.stdout.split()
        return subdomains
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e}")
        print(f"stderr: {e.stderr}")
        return []

def perform_google_search(query):
    google_search_url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={google_api_key}&cx={google_cx}'
    try:
        response = requests.get(google_search_url)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def extract_relevant_data(results):
    relevant_data = []
    for item in results.get('items', []):
        pagemap = item.get('pagemap', {})

        # Extract emails, telephones, faxnumbers from pagemap
        if 'email' in pagemap:
            relevant_data.append({"data": pagemap['email']})
        if 'telephone' in pagemap:
            relevant_data.append({"data": pagemap['telephone']})
        if 'faxnumber' in pagemap:
            relevant_data.append({"data": pagemap['faxnumber']})

        # Extract emails and telephones from educationalorganization
        if 'educationalorganization' in pagemap:
            for org in pagemap['educationalorganization']:
                if 'email' in org:
                    relevant_data.append({"data": org['email']})
                if 'telephone' in org:
                    relevant_data.append({"data": org['telephone']})
                if 'faxnumber' in org:
                    relevant_data.append({"data": org['faxnumber']})

        # Append link separately
        relevant_data.append({"data": item.get('link')})

    return relevant_data

def remove_duplicates(data):
    seen = set()
    unique_data = []
    for item in data:
        item_tuple = tuple(item.items())
        if item_tuple not in seen:
            seen.add(item_tuple)
            unique_data.append(item)
    return unique_data

@app.route('/search', methods=['GET'])
def search():
    domain = request.args.get('domain')
    domain_data = []

    # Subdomain Enumeration using assetfinder
    try:
        subdomains = get_subdomains(domain)
        if subdomains:
            for subdomain in subdomains:
                domain_data.append({"data": f"https://{subdomain}"})
        else:
            domain_data.append({"error": "No subdomains found or an error occurred"})
    except Exception as e:
        domain_data.append({"error": str(e)})

    # Google Dorking (Custom Search API)
    try:
        # General search for the domain
        general_info = perform_google_search(f'site:{domain}')
        domain_data.extend(extract_relevant_data(general_info))

        # Search for subdomains
        subdomains_info = perform_google_search(f'site:*.{domain}')
        domain_data.extend(extract_relevant_data(subdomains_info))

        # Search for emails
        emails_info = perform_google_search(f'site:{domain} intext:"@{domain}"')
        domain_data.extend(extract_relevant_data(emails_info))

        # Search for apps
        apps_info = perform_google_search(f'site:{domain} inurl:"/app"')
        domain_data.extend(extract_relevant_data(apps_info))

    except Exception as e:
        domain_data.append({"error": str(e)})

    # Remove duplicates
    domain_data = remove_duplicates(domain_data)

    # Clasificar URLs en bloques de 10
    classified_data = []
    for i in range(0, len(domain_data), 10):
        chunk = domain_data[i:i+10]
        classified_chunk = clasificar_urls(chunk)
        if "error" in classified_chunk:
            classified_data.append({"error": classified_chunk["error"]})
        else:
            classified_data.extend(classified_chunk)
        print(classified_data)

    return jsonify(classified_data)

if __name__ == '__main__':
    app.run(debug=True)
