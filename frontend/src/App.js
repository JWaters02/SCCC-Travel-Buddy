import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Button, ListGroupItem } from 'reactstrap';
import Modal from "./components/Modal";
import Landing from "./components/Landing";
import Logout from "./components/Logout";
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
  const [currentDate] = useState(new Date().toISOString().slice(0, 19));
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

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setUserDetails({
      id: "",
      email: "",
      username: "",
    });
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

  const createTrip = () => {
    const item = { tripName: "", location: "", startDate: "", endDate: "" };
    setActiveItem(item);
    setModal(true);
    setIsModalCreate(true);
  };

  const editTrip = (item) => {
    setActiveItem(item);
    setModal(true);
    setIsModalCreate(false);
  };

  const isPastDate = (endDate) => {
    return new Date(endDate) < new Date(currentDate);
  };

  const renderTripItems = (item) => {
    return (
      <ListGroupItem
        key={item.trip_id}
        className={`d-flex justify-content-between align-items-center ${isPastDate(item.end_date) ? "bg-light-red" : ""}`}
      >
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
        {isPastDate(item.end_date) || userDetails.id !== item.user_id ? null : (
          <span>
            <Button
              color="secondary"
              className="mr-2"
              onClick={() => editTrip(item)}
            >
              Edit
            </Button>
          </span>
        )}
        {userDetails.id === item.user_id && (
          <span>
            <Button
              color="danger"
              onClick={() => handleDelete(item)}
            >
              Delete
            </Button>
          </span>
        )}
      </ListGroupItem>
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
          <main>
            <Container>
              <Logout onLogoutSuccess={handleLogoutSuccess} />
              <h1 className="text-white text-center my-4">Trip Manager</h1>
              <Row>
                <Col md="6" sm="10" className="mx-auto p-0">
                  <Card>
                    <CardBody>
                      <div className="mb-4">
                        <p>Current Date: {currentDate}</p>
                        <Button color="primary" onClick={createTrip}>
                          Add trip
                        </Button>
                      </div>
                      <ul className="list-group list-group-flush border-top-0">
                        {trips.map(renderTripItems)}
                      </ul>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              {modal && (
                <Modal
                  key={isModalCreate ? 'create-modal' : 'edit-modal'}
                  isOpen={modal}
                  toggle={toggleModal}
                  isModalCreate={isModalCreate}
                  activeItemProp={activeItem}
                  onSave={isModalCreate ? handleAddTrip : handleEditTrip}
                />
              )}
            </Container>
          </main>
        </MapProvider>
      )}
    </div>
  );
}

export default App;