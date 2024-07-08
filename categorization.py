def categorize_by_function(data):
    function_categories = {
        "application_servers": [],
        "database_servers": [],
        "mail_servers": []
    }

    for item in data:
        if "dns_info" in item:
            function_categories["application_servers"].append({
                "dns_info": item["dns_info"]
            })
        elif "whois" in item:
            function_categories["mail_servers"].append({
                "domainName": item.get("WhoisRecord", {}).get("domainName", "N/A"),
                "link": item.get("WhoisRecord", {}).get("registryData", {}).get("whoisServer", "N/A")
            })
        elif "items" in item:
            for subitem in item["items"]:
                function_categories["mail_servers"].append({
                    "title": subitem.get("title", "N/A"),
                    "link": subitem.get("link", "N/A")
                })

    return function_categories


def categorize_by_data_type(data):
    data_type_categories = {
        "confidential_data": [],
        "public_data": []
    }

    for item in data:
        if "dns_info" in item:
            data_type_categories["public_data"].append({
                "dns_info": item["dns_info"]
            })
        elif "WhoisRecord" in item:
            data_type_categories["confidential_data"].append({
                "domainName": item.get("WhoisRecord", {}).get("domainName", "N/A")
            })
        elif "items" in item:
            for subitem in item["items"]:
                data_type_categories["public_data"].append({
                    "title": subitem.get("title", "N/A"),
                    "link": subitem.get("link", "N/A")
                })

    return data_type_categories


def categorize_by_sensitivity(data):
    sensitivity_categories = {
        "high_sensitivity": [],
        "medium_sensitivity": [],
        "low_sensitivity": []
    }

    for item in data:
        if "dns_info" in item:
            sensitivity_categories["low_sensitivity"].append({
                "dns_info": item["dns_info"]
            })
        elif "WhoisRecord" in item:
            sensitivity_categories["medium_sensitivity"].append({
                "domainName": item.get("WhoisRecord", {}).get("domainName", "N/A")
            })
        elif "items" in item:
            for subitem in item["items"]:
                sensitivity_categories["high_sensitivity"].append({
                    "title": subitem.get("title", "N/A"),
                    "link": subitem.get("link", "N/A")
                })

    return sensitivity_categories
