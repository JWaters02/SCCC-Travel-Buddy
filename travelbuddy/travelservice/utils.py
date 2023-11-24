import os
from dotenv import load_dotenv
import requests
import json
import logging

load_dotenv()
logger = logging.getLogger(__name__)

RANDOM_ORG_API_KEY = os.getenv('RANDOM_ORG_API_KEY')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')

def get_uuid():
    url = "https://api.random.org/json-rpc/2/invoke"
    headers = {'Content-Type': 'application/json'}
    payload = {
        "jsonrpc": "2.0",
        "method": "generateUUIDs",
        "params": {
            "apiKey": RANDOM_ORG_API_KEY,
            "n": 1
        },
        "id": 15998
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        data = response.json()

        if 'result' in data and 'random' in data['result'] and 'data' in data['result']['random']:
            return data['result']['random']['data'][0]
        else:
            raise ValueError("Malformed response from random.org")
    
    except requests.RequestException as e:
        logger.error(f"Network-related error when contacting random.org: {e}")
    except ValueError as ve:
        logger.error(f"Error in processing random.org response: {ve}")

    return None

def get_weather(location):
    url = "https://api.openweathermap.org/data/2.5/weather"
    payload = {
        "q": location,
        "appid": WEATHER_API_KEY
    }

    try:
        response = requests.get(url, params=payload)
        response.raise_for_status()
        data = response.json()

        if 'weather' in data:
            return data['weather'][0]['description']
        else:
            raise ValueError("Malformed response from openweathermap.org")
    
    except requests.RequestException as e:
        logger.error(f"Network-related error when contacting openweathermap.org: {e}")
    except ValueError as ve:
        logger.error(f"Error in processing openweathermap.org response: {ve}")

    return None