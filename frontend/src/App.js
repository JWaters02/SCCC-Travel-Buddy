import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';

const API = "http://localhost:8000/api";

const tempTrips = [
  {
    trip_id: '00000000-0000-0000-0000-000000000000',
    user_id: '00000000-0000-0000-0000-000000000000',
    location: 'London',
    start_date: '2024-01-01 00:00:00Z',
    end_date: '2024-01-01 00:00:00Z',
    weather_forcast: {
      temp: 0,
      description: 'Sunny',
      wind_speed: 0,
    }
  },
  {
    trip_id: '10000000-0000-0000-0000-000000000000',
    user_id: '10000000-0000-0000-0000-000000000000',
    location: 'Nottingham',
    start_date: '2024-01-01 00:00:00Z',
    end_date: '2024-01-01 00:00:00Z',
    weather_forcast: {
      temp: 10,
      description: 'Sunny',
      wind_speed: 50,
    }
  },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      start_date: "",
      end_date: "",
      trips: tempTrips,
    };
  }

  renderItems = (item) => {
    return (
      <li key={item.trip_id} 
      className="list-group-item d-flex justify-content-between align-items-center">
        <span>
          {item.location}
          : {item.start_date} 
          - {item.end_date}
        </span>
        <span>
          <button className="btn btn-secondary mr-2">
            Edit
          </button>
          <button className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    );
  };

  render() {
    const { trips } = this.state;
    return (
      <main className="container">
        <h1 className="text-white text text-center my-4">Trip Manager</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-primary">
                  Add trip
                </button>
              </div>
              <div className="App">
                <h1>Travel Planner</h1>
                <ul className="list-group">{trips.map(this.renderItems)}</ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;