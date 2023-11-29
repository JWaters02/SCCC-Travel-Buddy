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

def get_location(lat, lon):
    url = "http://api.openweathermap.org/geo/1.0/reverse"
    payload = {
        "lat": lat,
        "lon": lon,
        "limit": 1,
        "appid": WEATHER_API_KEY
    }

    try:
        response = requests.get(url, params=payload)
        if response.status_code != 200:
            return response.status_code, response.json()

        data = response.json()
        if len(data) > 0:
            return 200, f"{data[0]['name']}, {data[0]['state']}, {data[0]['country']}"
        else:
            return 200, "Unknown location"
    except requests.RequestException as e:
        logger.error(f"Network-related error when contacting openweathermap.org: {e}")
        return 500, {'error': str(e)}
    except Exception as e:
        logger.error(f"Error in processing or fetching the location data: {e}")
        return 500, {'error': str(e)}

def get_weather(lat, lon, start_date, end_date):
    # 1. convert the dates to unix timestamp
    # 2. make a call to the openweather forecase api using the location and api key
    # 3. check if any of the dates in the response json are between start and end dates
    # 4. if any of them are, pick the one closest to start date time
    # 5. return a json including the temp, feels like, humidity, description and wind speed
    # 6. if the end date is before any of them, then return empty
    # 7. if the start and end dates are after any of them, then return the last entry
    
    start_timestamp = int(start_date.timestamp())
    end_timestamp = int(end_date.timestamp())

    url = "https://api.openweathermap.org/data/2.5/forecast"
    payload = {
        "lat": lat,
        "lon": lon,
        "appid": WEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=payload)
        response.raise_for_status()
        forecast_data = response.json()
        relevant_forecast = None

        # Check if dates in the response are between the start and end dates
        for forecast in forecast_data['list']:
            forecast_time = forecast['dt']
            if start_timestamp <= forecast_time <= end_timestamp:
                relevant_forecast = forecast
                break
            elif forecast_time > end_timestamp:
                logger.info(f"get_weather: end date is before any forecast dates")
                return {}  # End date is before any forecast dates
        
        if relevant_forecast is None:
            # No forecasts within the range, check if start and end dates are after all forecasts
            last_forecast_time = forecast_data['list'][-1]['dt']
            if start_timestamp > last_forecast_time and end_timestamp > last_forecast_time:
                relevant_forecast = forecast_data['list'][-1]

        if relevant_forecast:
            weather_info = {
                'temp': relevant_forecast['main']['temp'],
                'feels_like': relevant_forecast['main']['feels_like'],
                'humidity': relevant_forecast['main']['humidity'],
                'description': relevant_forecast['weather'][0]['description'],
                'wind_speed': relevant_forecast['wind']['speed']
            }
            logger.info(f"get_weather: {weather_info}")
            return weather_info
        else:
            return None

    except requests.RequestException as e:
        logger.error(f"Network-related error when contacting openweathermap.org: {e}")
        return None
    except Exception as e:
        logger.error(f"Error in processing or fetching the weather data: {e}")
        return None