# app.py
from flask import Flask, request, jsonify
import whois as whois_lib
import dns.resolver
import shodan
import requests
from flask_cors import CORS

from categorization import categorize_by_function, categorize_by_data_type, categorize_by_sensitivity

app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda la aplicación

# Configura tus propias claves de API aquí
whois_api_key = 'at_uF7JEqGboHW8XMG9LEkbGjCTbbz4X'
shodan_api = 'GbVZ8Zp8a9hWAnhN9qwwEuU66JkyO514'
google_api_key = 'AIzaSyBSt4-7B41fv_rMg60AJXZgV1gthw5DsBc'
google_cx = '2081fc0796d0f4ad2'

shodan_client = shodan.Shodan(shodan_api)

@app.route('/search', methods=['GET'])
def search():
    domain = request.args.get('domain')
    domain_data = []
    
    # Whois Lookup
    try:
        whois_url = f"https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey={whois_api_key}&domainName={domain}&outputFormat=JSON"
        whois_response = requests.get(whois_url)
        whois_info = whois_response.json()
        domain_data.append(whois_info)
    except Exception as e:
        whois_info = {"error": str(e)}
        domain_data.append(whois_info)
    
    # DNS Enumeration
    try:
        dns_info = dns.resolver.resolve(domain, 'A')
        dns_data = [str(rdata) for rdata in dns_info]
        domain_data.append({"dns_info": dns_data})
    except Exception as e:
        dns_info = {"error": str(e)}
        domain_data.append(dns_info)
    
    # Shodan Lookup
    try:
        shodan_info = shodan_client.host(domain)
        domain_data.append(shodan_info)
    except Exception as e:
        shodan_info = {"error": str(e)}
        domain_data.append(shodan_info)
    
    # Google Dorking (Custom Search API)
    try:
        google_search_url = f'https://www.googleapis.com/customsearch/v1?q=site:{domain}&key={google_api_key}&cx={google_cx}'
        google_info = requests.get(google_search_url).json()
        domain_data.append(google_info)
    except Exception as e:
        google_info = {"error": str(e)}
        domain_data.append(google_info)
    
    # Categorization
    function_categories = categorize_by_function(domain_data)
    data_type_categories = categorize_by_data_type(domain_data)
    sensitivity_categories = categorize_by_sensitivity(domain_data)
    
    result = {
        "function_categories": function_categories,
        "data_type_categories": data_type_categories,
        "sensitivity_categories": sensitivity_categories
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
