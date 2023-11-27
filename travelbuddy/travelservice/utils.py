import os
from dotenv import load_dotenv
import requests
import json
import logging

load_dotenv()
logger = logging.getLogger(__name__)

RANDOM_ORG_API_KEY = os.getenv('RANDOM_ORG_API_KEY')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
GEODB_API_KEY = os.getenv('GEODB_API_KEY')

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

def get_weather(location, start_date, end_date):
    # 1. convert the dates to unix timestamp
    # 2. make a call to the openweather forecase api using the location and api key
    # 3. if the response is a 404 city not found, re call the api with an expanded search using the geoDB api
    # 4. if there is a response, check if any of the dates in the response json are between start and end dates
    # 5. if any of them are, pick the one closest to start date time
    # 6. return a json including the temp, feels like, humidity, description and wind speed
    # 7. if the end date is before any of them, then return empty
    # 8. if the start and end dates are after any of them, then return the last entry
    
    start_timestamp = int(start_date.timestamp())
    end_timestamp = int(end_date.timestamp())
    locations_tried = 0
    locations_to_try = [location]
    locations_tried = []
    for location in locations_to_try:
        if location in locations_tried: continue

        url = "https://api.openweathermap.org/data/2.5/forecast"
        payload = {
            "q": location,
            "appid": WEATHER_API_KEY,
            "units": "metric"
        }

        try:
            response = requests.get(url, params=payload)
            response.raise_for_status()
            forecast_data = response.json()

            if forecast_data['cod'] == '404':
                # City not found, try to expand the search
                expanded_location = expand_search(location)
                logger.info(f"get_weather: expanded_location: {expanded_location}")
                if expanded_location is not None:
                    locations_to_try.append(expanded_location)
                    continue
                if locations_tried >= 5:
                    logger.info("get_weather: tried and failed at 5 locations, returning empty")
                    return {}
            else:
                locations_tried.append(location)
                locations_tried += 1

            # Check if dates in the response are between the start and end dates
            relevant_forecast = None
            for forecast in forecast_data['list']:
                forecast_time = forecast['dt']
                if start_timestamp <= forecast_time <= end_timestamp:
                    relevant_forecast = forecast
                    break
                elif forecast_time > end_timestamp:
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
                return {}

        except requests.RequestException as e:
            logger.error(f"Network-related error when contacting openweathermap.org: {e}")
            return None
        except Exception as e:
            logger.error(f"Error in processing or fetching the weather data: {e}")
            return None
    return {}

def expand_search(current_location):
    # use geoDB api to expand the search

    url = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities"

    return None