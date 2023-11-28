import Cookies from 'js-cookie';
import axios from 'axios';

const axiosWithAuth = () => {
    const token = Cookies.get('token');
    return axios.create({
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Get from /api/uuid/
export const getUUID = async () => {
    try {
        const response = await axiosWithAuth().get("/api/uuid/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Get from /api/location/?latitude=${latitude}&longitude=${longitude}
export const getLocation = async (latitude, longitude) => {
    try {
        const response = await axiosWithAuth.get(`/api/location/?latitude=${latitude}&longitude=${longitude}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Post to /api/trips/
export const addTrip = async (item, userDetails) => {
    const { tripName, latitude, longitude, startDate, endDate } = item;
    const body = {
        user_id: userDetails.id,
        trip_name: tripName,
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate
    };

    try {
        const response = await axiosWithAuth().post("/api/trips/", body);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Get from /api/trips/
export const getTrips = async () => {
    try {
        const response = await axiosWithAuth().get("/api/trips/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Post to /api/interests/
export const expressInterestInTrip = async (tripId, userDetails) => {
    const body = {
        user_id: userDetails.id,
        trip_id: tripId
    };

    try {
        const response = await axiosWithAuth().post("/api/interests/", body);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
};

// Put to /api/trips/${tripId}/
export const updateTrip = async (item, tripId, userDetails) => {
    const { tripName, latitude, longitude, startDate, endDate } = item;
    const body = {
        user_id: userDetails.id,
        trip_name: tripName,
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate
    };

    try {
        const response = await axiosWithAuth().put(`/api/trips/${tripId}/`, body);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Delete from /api/trips/${tripId}/
export const deleteTrip = async (tripId) => {
    try {
        const response = await axiosWithAuth().delete(`/api/trips/${tripId}/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Post to /api/register/
export const register = async (registerData) => {
    try {
        const response = await axios.post('/api/register/', registerData);
        const { token, user_id, email, username } = response.data;
        Cookies.set('token', token);
        return { id: user_id, email, username };
    } catch (error) {
        console.error("Registration error", error);
        throw error;
    }
};

// Post to /api/login/
export const login = async (loginData) => {
    try {
        const response = await axios.post('/api/login/', loginData);
        const { token, user_id, email, username } = response.data;
        Cookies.set('token', token);
        return { id: user_id, email, username };
    } catch (error) {
        console.error("Login error", error);
        throw error;
    }
};

// Post to /api/logout/
export const logout = async () => {
    try {
        const response = await axiosWithAuth().post("/api/logout/");
        Cookies.remove('token');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Get from /api/reauth/
export const reauthenticate = async () => {
    try {
        const response = await axiosWithAuth().get("/api/reauth/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
