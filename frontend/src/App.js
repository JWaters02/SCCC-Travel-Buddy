import React, { Component } from "react";
import Modal from "./components/Modal";
import Landing from "./components/Landing";
import MapProvider from "./components/MapProvider";
import { addTrip, reauthenticate, getTrips } from "./api";
import Cookies from "js-cookie";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {
        id: "",
        email: "",
        username: "",
      },
      trips: [],
      isPastDate: false,
      isLoggedIn: false,
      isLogin: true,
      currentDate: new Date().toISOString().slice(0, 19),
      modal: false,
      activeItem: {
        tripName: "",
        longitude: 0.0,
        latitude: 0.0,
        startDate: "",
        endDate: "",
      }
    };
  }

  componentDidMount() {
    const token = Cookies.get('token');
    if (token) {
      if (this.state.userDetails.id === "") {
        reauthenticate()
          .then((data) => {
            this.setState({
              userDetails: {
                id: data.user_id,
                email: data.email,
                username: data.username,
              }
            });
          })
          .catch((error) => console.log(error));
      }
      this.setState({ isLoggedIn: true });
      this.refreshTripsList();
    }
  }

  refreshTripsList = () => {
    getTrips()
      .then((data) => {
        this.setState({ trips: data });
      })
      .catch((error) => console.log(error));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleLoginSuccess = (details) => {
    this.setState({
      isLoggedIn: true,
      userDetails: details
    }, () => {
      this.refreshTripsList();
    });
  };

  handleAddTrip = (item) => {
    this.toggle();

    addTrip(item, this.state.userDetails)
      .then((data) => {
        this.refreshTripsList();
      })
      .catch((error) => console.log(error));
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

  toggleLogin = () => {
    this.setState({ isLogin: !this.state.isLogin });
  };

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

    if (!isLoggedIn) {
      return (
        <Landing
          onLoginSuccess={this.handleLoginSuccess}
          onRegisterSuccess={this.handleLoginSuccess}
        />
      );
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
              onSave={this.handleAddTrip}
            />
          ) : null}
        </main>
      </MapProvider>
    );
  }
}

export default App;