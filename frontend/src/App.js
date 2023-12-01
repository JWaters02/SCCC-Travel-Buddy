import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import CustomModal from "./components/Modal";
import Landing from "./components/Landing";
import Logout from "./components/Logout";
import MapProvider from "./components/MapProvider";
import {
  addTrip,
  updateTrip,
  deleteTrip,
  getTrips,
  reauthenticate,
  expressInterestInTrip
} from "./api";
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
  const [modalMode, setModalMode] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tripFilter, setTripFilter] = useState('All trips');
  const [showEndedTrips, setShowEndedTrips] = useState(false);
  const [selectedTripForDeletion, setSelectedTripForDeletion] = useState(null);
  const [alerts, setAlerts] = useState({
    errorMessage: "",
    warningMessage: "",
    successMessage: ""
  });
  const [activeItem, setActiveItem] = useState({
    trip_id: "",
    trip_name: "",
    location: "",
    longitude: 0.0,
    latitude: 0.0,
    start_date: "",
    end_date: "",
    interests: 0,
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
    if (modal) {
      setAlerts({
        errorMessage: "",
        warningMessage: "",
        successMessage: ""
      });
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleEndedTrips = () => {
    setShowEndedTrips(!showEndedTrips);
  };

  const selectTripFilter = (filter) => {
    setTripFilter(filter);
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

  const handleRegisterInterest = (item) => {
    expressInterestInTrip(item.trip_id, userDetails)
      .then(response => {
        if (response.status === 'error') {
          setAlerts({ warningMessage: response.errorMessages.join(", ") });
        } else {
          setAlerts({ successMessage: "Successfully registered interest!" });
          refreshTripsList();
        }
      })
      .catch((error) => {
        setAlerts({ errorMessage: error.toString() });
        console.log(error)
      });
  }

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
    setSelectedTripForDeletion(item);
  };

  const confirmDelete = () => {
    if (selectedTripForDeletion) {
      deleteTrip(selectedTripForDeletion.trip_id)
        .then(() => {
          refreshTripsList();
          setSelectedTripForDeletion(null);
        })
        .catch((error) => console.log(error));
    }
  };

  const createTrip = () => {
    const item = { trip_name: "", location: "", start_date: "", end_date: "" };
    setModal(true);
    setActiveItem(item);
    setModalMode("Create");
  };

  const editTrip = (item) => {
    const editedItem = {
      ...item,
      start_date: convertToDateTimeLocal(item.start_date),
      end_date: convertToDateTimeLocal(item.end_date),
    };
    setActiveItem(editedItem);
    setModal(true);
    setModalMode("Edit");
  };

  const viewTrip = (item) => {
    const viewedItem = {
      ...item,
      start_date: convertToDateTimeLocal(item.start_date),
      end_date: convertToDateTimeLocal(item.end_date),
    };
    setActiveItem(viewedItem);
    setModal(true);
    setModalMode("View");
  };

  const isPastDate = (end_date) => {
    return new Date(end_date) < new Date(currentDate);
  };

  const convertToDateTimeLocal = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const filteredTrips = trips.filter((trip) => {
    if (!showEndedTrips && isPastDate(trip.end_date)) {
      return false;
    }

    switch (tripFilter) {
      case 'My trips':
        return trip.user_id === userDetails.id;
      case 'Public trips':
        return trip.user_id !== userDetails.id;
      default:
        return true;
    }
  });

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
          <span className="mr-2">
            {item.interests}
          </span>
        </span>
        {isPastDate(item.end_date) || userDetails.id !== item.user_id ? null : (
          <span>
            <Button color="secondary" className="mr-2" onClick={() => editTrip(item)}>Edit</Button>
          </span>
        )}
        {userDetails.id === item.user_id && (
          <span>
            <Button color="danger" onClick={() => handleDelete(item)}>Delete</Button>
          </span>
        )}
        {userDetails.id !== item.user_id && (
          <span>
            <Button color="info" onClick={() => viewTrip(item)}>View</Button>
          </span>
        )}
      </ListGroupItem>
    );
  };

  return (
    <div>
      <main>
        <Container>
          <h1 className="text-black text-center my-4">Trip Manager</h1>
          <Row>
            <Col className="mx-auto p-0 card-container">
              <Card>
                <CardBody>
                  {!isLoggedIn ? (
                    <Landing
                      onLoginSuccess={handleLoginSuccess}
                      onRegisterSuccess={handleLoginSuccess}
                    />
                  ) : (
                    <MapProvider>
                      <div className="mb-4">
                        <p>Current Date: {currentDate}</p>
                        <p>Welcome {userDetails.username}!</p>
                        <Button color="primary" onClick={createTrip}>
                          Add trip
                        </Button>
                      </div>
                      <div className="mb-4 d-flex align-items-center">
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                          <DropdownToggle caret>
                            {tripFilter}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => selectTripFilter('All trips')}>All trips</DropdownItem>
                            <DropdownItem onClick={() => selectTripFilter('My trips')}>My trips</DropdownItem>
                            <DropdownItem onClick={() => selectTripFilter('Public trips')}>Public trips</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <Button color="info" onClick={toggleEndedTrips} className="ml-2">
                          {showEndedTrips ? 'Hide Ended Trips' : 'Show Ended Trips'}
                        </Button>
                      </div>
                      <ul className="list-group list-group-flush border-top-0">
                        {filteredTrips.map(renderTripItems)}
                      </ul>
                      <br />
                      <Logout onLogoutSuccess={handleLogoutSuccess} />
                      {modal && activeItem !== undefined && (
                        <CustomModal
                          toggle={toggleModal}
                          modalMode={modalMode}
                          activeItem={activeItem}
                          setActiveItem={setActiveItem}
                          onSave={() => {
                            if (modalMode === "Create") {
                              handleAddTrip(activeItem);
                            } else if (modalMode === "Edit") {
                              handleEditTrip(activeItem);
                            }
                          }}
                          isPastDate={isPastDate}
                          onInterested={handleRegisterInterest}
                          alerts={alerts}
                        />
                      )}
                      <Modal isOpen={selectedTripForDeletion !== null} toggle={() => setSelectedTripForDeletion(null)}>
                        <ModalHeader toggle={() => setSelectedTripForDeletion(null)}>Confirm Deletion</ModalHeader>
                        <ModalBody>
                          Are you sure you want to delete this trip: {selectedTripForDeletion?.trip_name}?
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" onClick={confirmDelete}>Confirm Delete</Button>{' '}
                          <Button color="secondary" onClick={() => setSelectedTripForDeletion(null)}>Cancel</Button>
                        </ModalFooter>
                      </Modal>
                    </MapProvider>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default App;