from flask import Flask, request, jsonify
import subprocess
import requests
import dns.resolver

from flask_cors import CORS
from gpt import clasificar_urls 

app = Flask(__name__)
CORS(app)  # Habilitar CORS

# Claves de API
whois_api_key = 'at_uF7JEqGboHW8XMG9LEkbGjCTbbz4X'
google_api_key = 'AIzaSyBSt4-7B41fv_rMg60AJXZgV1gthw5DsBc'
google_cx = '2081fc0796d0f4ad2'

def get_subdomains(domain):
    assetfinder_path = r"C:\Users\andre\go\bin\assetfinder.exe"
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

        if 'email' in pagemap:
            relevant_data.append({"data": pagemap['email']})
        if 'telephone' in pagemap:
            relevant_data.append({"data": pagemap['telephone']})
        if 'faxnumber' in pagemap:
            relevant_data.append({"data": pagemap['faxnumber']})

        if 'educationalorganization' in pagemap:
            for org in pagemap['educationalorganization']:
                if 'email' in org:
                    relevant_data.append({"data": org['email']})
                if 'telephone' in org:
                    relevant_data.append({"data": org['telephone']})
                if 'faxnumber' in org:
                    relevant_data.append({"data": org['faxnumber']})

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

    # Assetfinder
    try:
        subdomains = get_subdomains(domain)
        if subdomains:
            for subdomain in subdomains:
                domain_data.append({"data": f"https://{subdomain}"})
        else:
            domain_data.append({"error": "No subdomains found or an error occurred"})
    except Exception as e:
        domain_data.append({"error": str(e)})

    # Whois Lookup
    try:
        whois_url = f"https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey={whois_api_key}&domainName={domain}&outputFormat=JSON"
        whois_response = requests.get(whois_url)
        whois_info = whois_response.json()
    except Exception as e:
        whois_info = {"error": str(e)}
    
    # DNS Enumeration
    try:
        dns_info = dns.resolver.resolve(domain, 'A')
        dns_data = [str(rdata) for rdata in dns_info]
    except Exception as e:
        dns_info = {"error": str(e)}

    # Google search
    try:
        # General
        general_info = perform_google_search(f'site:{domain}')
        domain_data.extend(extract_relevant_data(general_info))

        # Subdominios
        subdomains_info = perform_google_search(f'site:*.{domain}')
        domain_data.extend(extract_relevant_data(subdomains_info))

        # Emails
        emails_info = perform_google_search(f'site:{domain} intext:"@{domain}"')
        domain_data.extend(extract_relevant_data(emails_info))

        # Apps
        apps_info = perform_google_search(f'site:{domain} inurl:"/app"')
        domain_data.extend(extract_relevant_data(apps_info))

    except Exception as e:
        domain_data.append({"error": str(e)})

    # Remove duplicates
    domain_data = remove_duplicates(domain_data)

    # Clasificar URLs en bloques de 10
    classified_data = []
    for i in range(0, len(domain_data[:10]), 5):
        chunk = domain_data[i:i+5]
        classified_chunk = clasificar_urls(chunk)
        if "error" in classified_chunk:
            classified_data.append({"error": classified_chunk["error"]})
        else:
            classified_data.extend(classified_chunk)

    # # Clasificar únicamente los primeros 15 datos
    # domain_data = domain_data[:5]
    # classified_data = clasificar_urls(domain_data)

    return jsonify(classified_data)

if __name__ == '__main__':
    app.run(debug=True, port=9000)
