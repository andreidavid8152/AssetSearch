# categorization.py

def categorize_by_function(domain_data):
    categorized_data = {
        "database_servers": [],
        "application_servers": [],
        "mail_servers": [],
    }
    for item in domain_data:
        if isinstance(item, dict):
            if 'registryData' in item:
                categorized_data["database_servers"].append(item)
            elif 'dns_info' in item:
                categorized_data["application_servers"].append(item)
            elif 'mail' in str(item):
                categorized_data["mail_servers"].append(item)
    return categorized_data

def categorize_by_data_type(domain_data):
    categorized_data = {
        "sensitive_data": [],
        "confidential_data": [],
        "public_data": [],
    }
    for item in domain_data:
        if isinstance(item, dict):
            if 'confidential' in str(item).lower():
                categorized_data["confidential_data"].append(item)
            elif 'public' in str(item).lower():
                categorized_data["public_data"].append(item)
            else:
                categorized_data["public_data"].append(item)
    return categorized_data

def categorize_by_sensitivity(domain_data):
    categorized_data = {
        "high_sensitivity": [],
        "medium_sensitivity": [],
        "low_sensitivity": [],
    }
    for item in domain_data:
        if isinstance(item, dict):
            if 'error' in item:
                categorized_data["low_sensitivity"].append(item)
            elif 'high' in str(item).lower():
                categorized_data["high_sensitivity"].append(item)
            elif 'medium' in str(item).lower():
                categorized_data["medium_sensitivity"].append(item)
            else:
                categorized_data["low_sensitivity"].append(item)
    return categorized_data
