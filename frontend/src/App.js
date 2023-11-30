import React, { useState, useEffect } from "react";
import Modal from "./components/Modal";
import Landing from "./components/Landing";
import MapProvider from "./components/MapProvider";
import { addTrip, updateTrip, deleteTrip, getTrips, reauthenticate } from "./api";
import Cookies from "js-cookie";
import './App.css';

const App = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    email: "",
    username: "",
  });
  const [trips, setTrips] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 19));
  const [modal, setModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(true);
  const [activeItem, setActiveItem] = useState({
    tripId: "",
    tripName: "",
    location: "",
    longitude: 0.0,
    latitude: 0.0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      if (userDetails.id === "") {
        reauthenticate()
          .then((data) => {
            setUserDetails({
              id: data.user_id,
              email: data.email,
              username: data.username,
            });
          })
          .catch((error) => console.log(error));
      }
      setIsLoggedIn(true);
      refreshTripsList();
    }
  }, [userDetails.id]);

  const refreshTripsList = () => {
    getTrips()
      .then((data) => {
        setTrips(data);
      })
      .catch((error) => console.log(error));
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleLoginSuccess = (details) => {
    setUserDetails(details);
    setIsLoggedIn(true);
    refreshTripsList();
  };

  const handleAddTrip = (item) => {
    toggleModal();
    addTrip(item, userDetails)
      .then(() => {
        refreshTripsList();
      })
      .catch((error) => console.log(error));
  };

  const handleEditTrip = (item) => {
    toggleModal();
    updateTrip(item, userDetails)
      .then(() => {
        refreshTripsList();
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (item) => {
    deleteTrip(item.trip_id)
      .then(() => {
        refreshTripsList();
      })
      .catch((error) => console.log(error));
  };

  const createItem = () => {
    const item = { tripName: "", location: "", startDate: "", endDate: "" };
    setActiveItem(item);
    setModal(true);
    setIsModalCreate(true);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(true);
    setIsModalCreate(false);
  };

  const isPastDate = (endDate) => {
    return new Date(endDate) < new Date(currentDate);
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  const renderItems = (item) => {
    return (
      <li key={item.trip_id}
        className={`list-group-item d-flex justify-content-between align-items-center ${isPastDate(item.end_date) ? "bg-light-red" : ""}`}>
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
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    );
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Landing
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleLoginSuccess}
        />
      ) : (
        <MapProvider>
          <main className="container">
            <h1 className="text-white text-center my-4">Trip Manager</h1>
            <div className="row">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  <div className="mb-4">
                    <p>Current Date: {currentDate}</p>
                    <button
                      className="btn btn-primary"
                      onClick={createItem}
                    >
                      Add trip
                    </button>
                  </div>
                  <ul className="list-group list-group-flush border-top-0">
                    {trips.map(renderItems)}
                  </ul>
                </div>
              </div>
            </div>
            {modal && (
              <Modal
                key={isModalCreate ? 'create-modal' : 'edit-modal'}
                isModalCreate={isModalCreate}
                activeItemProp={activeItem}
                toggle={toggleModal}
                onSave={isModalCreate ? handleAddTrip : handleEditTrip}
              />
            )}
          </main>
        </MapProvider>
      )}
    </div>
  );
}

export default App;