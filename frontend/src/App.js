import React, { Component } from "react";
import Modal from "./components/Modal";
import Login from "./components/Login";
import MapProvider from "./components/MapProvider";
import Cookies from "js-cookie";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      isPastDate: false,
      isLoggedIn: false,
      currentDate: new Date().toISOString().slice(0, 19),
      modal: false,
      activeItem: {
        name: "",
        longitude: 0.0,
        latitude: 0.0,
        startDate: "",
        endDate: "",
      }
    };
  }

  componentDidMount() {
    if (Cookies.get('token')) {
      this.setState({ isLoggedIn: true });
    }
    this.refreshList();
  }

  refreshList = () => {
    const token = Cookies.get('token');
    console.log(token);
    fetch("/api/trips/", {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ trips: data });
      })
      .catch((error) => console.log(error));
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleLoginSuccess = () => {
    console.log("Login successful");
    this.setState({ isLoggedIn: true });
    this.refreshList();
  };

  handleSubmit = (item) => {
    this.toggle();


  };

  handleDelete = (item) => {
    alert("delete" + JSON.stringify(item));
  };

  createItem = () => {
    const item = { tripName: "", location: "", startDate: "", endDate: "" };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  isPastDate = (endDate) => {
    return new Date(endDate) < new Date(this.state.currentDate);
  }

  renderItems = (item) => {
    return (
      <li key={item.trip_id}
        className={`list-group-item d-flex justify-content-between align-items-center ${this.isPastDate(item.end_date) ? "bg-light-red" : ""}`}>
        <span>
          <span className="mr-2">
            {item.trip_name}:
          </span>
          <span className="mr-2">
            {item.location},
          </span>
          <span className="mr-2">
            {item.start_date}
          </span>
          <span className="mr-2">
            {item.end_date}
          </span>
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    );
  };

  render() {
    const { trips, isLoggedIn, currentDate, modal, activeItem } = this.state;
    console.log(trips);
    console.log(isLoggedIn);
    console.log(process.env.GOOGLE_MAPS_API_KEY);

    if (!isLoggedIn) {
      return <Login onLoginSuccess={this.handleLoginSuccess} />;
    }

    return (
      <MapProvider>
        <main className="container">
          <h1 className="text-white text text-center my-4">Trip Manager</h1>
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="card p-3">
                <div className="mb-4">
                  <p>Current Date: {currentDate}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={this.createItem}
                  >
                    Add trip
                  </button>
                </div>
                <ul className="list-group list-group-flush border-top-0">
                  {trips.map(this.renderItems)}
                </ul>
              </div>
            </div>
          </div>
          {modal ? (
            <Modal
              activeItem={activeItem}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}
        </main>
      </MapProvider>
    );
  }
}

export default App;