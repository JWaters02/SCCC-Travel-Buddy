from locust import HttpUser, task, between, TaskSet, SequentialTaskSet
import random
import string
import uuid

global_trip_name = None
global_trip_id = None

def random_string(length=10):
    """Generate a random string of fixed length."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

# class TripActions(SequentialTaskSet):
    # - log into testuser
    # - get user_id and token from the login response
    # - testuser gets trips
    # - testuser adds a new trip with a random trip_name and the user_id it has, following this request schema. the trip_id is returned in the response payload
    # {"user_id":"64eec4dd-d222-41f8-a910-00f04dbe1737","trip_name":"Test trip 2","location":"Nottingham, England, GB","latitude":52.948,"longitude":-1.144,"start_date":"2024-01-18T11:11","end_date":"2024-01-19T11:11"}
    # - testuser gets trips and checks if the new trip with the random name exists
    # - testuser logs out
    # - testuser2 logs in with credentials username: testuser2 and password: pass
    # - testuser2 gets trips
    # - testuser2 checks if the new trip testuser just made exists
    # - if it does exist, express interest in the trip using the trip_id from the create trip response
    # - testuser2 gets trips
    # - testuser2 checks if the trip it just registered interest in has interests field of 1
    
    user_id = None

    def on_start(self):
        self.user_login("testuser", "pass")

    def user_login(self, username, password):
        with self.client.post("api/login/", {"username": username, "password": password}, catch_response=True) as response:
            if response.status_code == 200:
                self.user_id = response.json()['user_id']
                self.token = response.json()['token']
            else:
                response.failure("Failed to log in")

    @task
    def add_trip(self):
        global global_trip_name, global_trip_id
        global_trip_name = random_string()
        payload = {
            "user_id": self.user_id,
            "trip_name": global_trip_name,
            "location": "Nottingham, England, GB",
            "latitude": 52.948,
            "longitude": -1.144,
            "start_date": "2024-01-18T11:11",
            "end_date": "2024-01-19T11:11"
        }
        trip_id = uuid.uuid4()
        with self.client.post(f"api/trips/{trip_id}/", json=payload, headers={'Authorization': f'Token {self.token}'}, catch_response=True) as response:
            if response.status_code == 201:
                global_trip_id = response.json()['trip_id']
            else:
                response.failure("Failed to add trip")

    @task
    def check_trip_exists(self):
        global global_trip_name
        with self.client.get("api/trips/", headers={'Authorization': f'Token {self.token}'}, catch_response=True) as response:
            if response.status_code == 200:
                trips = response.json()
                assert any(trip['trip_name'] == global_trip_name for trip in trips)

    @task
    def testuser2_actions(self):
        global global_trip_name, global_trip_id
        self.client.post("api/logout/", headers={'Authorization': f'Token {self.token}'})
        # Login as testuser2
        with self.client.post("api/login/", {"username": "testuser2", "password": "pass"}, catch_response=True) as response:
            if response.status_code == 200:
                token = response.json()['token']
                print("1")
                # Get trips
                with self.client.get("api/trips/", headers={'Authorization': f'Token {token}'}, catch_response=True) as response:
                    if response.status_code == 200:
                        trips = response.json()
                        print("2")
                        print(global_trip_id)
                        print(global_trip_name)
                        # Check if new trip exists and express interest
                        if any(trip['trip_name'] == global_trip_name for trip in trips):
                            print("3")
                            self.client.post(f"api/interests/{global_trip_id}", headers={'Authorization': f'Token {token}'})
                            # Check if interests field is updated
                            with self.client.get(f"api/trips/{global_trip_id}/", headers={'Authorization': f'Token {token}'}, catch_response=True) as response:
                                if response.status_code == 200:
                                    print("4")
                                    trip = response.json()
                                    assert trip['interests'] == 1
        self.client.post("api/logout/", headers={'Authorization': f'Token {self.token}'})
        global_trip_name = None
        global_trip_id = None
        print("5")

class TripActionSet(SequentialTaskSet):
    trip_id = None
    user_id = None
    trip_name = None

    def on_start(self):
        self.user_login("testuser", "pass")

    def user_login(self, username, password):
        with self.client.post("api/login/", {"username": username, "password": password}, catch_response=True) as response:
            if response.status_code == 200:
                self.user_id = response.json()['user_id']
                self.token = response.json()['token']
            else:
                response.failure("Failed to log in")

    @task
    def add_trip(self):
        self.trip_name = random_string()
        self.trip_id = uuid.uuid4()
        payload = {
            "user_id": self.user_id,
            "trip_name": self.trip_name,
            "location": "Nottingham, England, GB",
            "latitude": 52.948,
            "longitude": -1.144,
            "start_date": "2024-01-18T11:11",
            "end_date": "2024-01-19T11:11"
        }
        with self.client.post(f"api/trips/{self.trip_id}/", json=payload, headers={'Authorization': f'Token {self.token}'}, catch_response=True) as response:
            if response.status_code == 201:
                self.trip_id = response.json()['trip_id']
            else:
                response.failure("Failed to add trip")

    @task
    def check_trip_exists(self):
        with self.client.get("api/trips/", headers={'Authorization': f'Token {self.token}'}, catch_response=True) as response:
            if response.status_code == 200:
                trips = response.json()
                assert any(trip['trip_name'] == self.trip_name for trip in trips)
            else:
                response.failure("Failed to get trips")

    @task
    def delete_trip(self):
        with self.client.delete(f"api/trips/{self.trip_id}/", headers={'Authorization': f'Token {self.token}'}, catch_response=True) as response:
            if response.status_code == 204:
                self.trip_id = None
            else:
                response.failure("Failed to delete trip")

class GetTripAction(TaskSet):
    token = '749c141298956e27175fb9af6b609e0baaf778b4'
    
    @task
    def get_trips(self):
        with self.client.get("api/trips/", headers={'Authorization': f'Token {self.token}'}, catch_response=True) as response:
            if not response.status_code == 200:
                response.failure("Failed to get trips")

class WebsiteUser(HttpUser):
    tasks = [TripActionSet]
    wait_time = between(1, 5)

class TripGetter(HttpUser):
    tasks = [GetTripAction]
    wait_time = between(1, 1)
