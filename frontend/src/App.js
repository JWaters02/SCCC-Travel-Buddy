import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';

const API = "http://localhost:8000/";

const tempTrips = [
  {
    trip_id: '00000000-0000-0000-0000-000000000000',
    user_id: '00000000-0000-0000-0000-000000000000',
    tripName: 'Trip 1',
    location: 'London',
    startDate: '2024-01-01T00:00:00',
    endDate: '2024-01-01T00:00:00',
    weather_forcast: {
      temp: 0,
      description: 'Sunny',
      wind_speed: 0,
    }
  },
  {
    trip_id: '10000000-0000-0000-0000-000000000000',
    user_id: '10000000-0000-0000-0000-000000000000',
    tripName: 'Trip 2',
    location: 'Nottingham',
    startDate: '2024-01-01T00:00:00',
    endDate: '2023-01-01T00:00:00',
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
      tripName: "",
      startDate: "",
      endDate: "",
      trips: tempTrips,
      isPastDate: false,
      currentDate: new Date().toISOString().slice(0, 19),
    };
  }

  isPastDate = (endDate) => {
    return new Date(endDate) < new Date(this.state.currentDate);
  }

  renderItems = (item) => {
    return (
      <li key={item.trip_id} 
      className={`list-group-item d-flex justify-content-between align-items-center ${
        this.isPastDate(item.endDate) ? "bg-light-red" : "" }`}>
        <span>
          <span className="mr-2">
            {item.tripName}:
          </span>
          <span className="mr-2">
            {item.location},
          </span>
          <span className="mr-2">
            {item.startDate}
          </span>
          <span className="mr-2">
            {item.endDate}
          </span>
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
                <p>Current Date: {this.state.currentDate}</p>
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