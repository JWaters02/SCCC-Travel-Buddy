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
        const response = await axios.get("/api/uuid/");
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return getUUID();
        }
        console.error(error);
    }
};

// Get from /api/location/?lat=${latitude}&lon=${longitude}
export const getLocation = async (latitude, longitude) => {
    try {
        const response = await axios.get(`/api/location/?lat=${latitude}&lon=${longitude}`);
        return response.data.location;
    } catch (error) {
        console.error("Location retrieval error", error);
        if (error.response && error.response.status !== 200) {
            const errorMessages = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`);
            return { status: 'error', errorMessages };
        }
        throw error;
    }
};

// Get from /api/trips/${trip_id}/
export const getTrip = async (trip_id) => {
    try {
        const response = await axiosWithAuth().get(`/api/trips/${trip_id}/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Post to /api/trips/${trip_id}/
export const addTrip = async (item, userDetails) => {
    const { trip_id, trip_name, location, latitude, longitude, start_date, end_date } = item;
    const body = {
        user_id: userDetails.id,
        trip_name,
        location,
        latitude,
        longitude,
        start_date,
        end_date
    };

    try {
        const response = await axiosWithAuth().post(`/api/trips/${trip_id}/`, body);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Put to /api/trips/${trip_id}/
export const updateTrip = async (item, userDetails) => {
    const { trip_id, trip_name, latitude, longitude, start_date, end_date } = item;
    const body = {
        user_id: userDetails.id,
        trip_name: trip_name,
        latitude,
        longitude,
        start_date: start_date,
        end_date: end_date
    };

    try {
        const response = await axiosWithAuth().put(`/api/trips/${trip_id}/`, body);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Delete from /api/trips/${trip_id}/
export const deleteTrip = async (trip_id) => {
    try {
        const response = await axiosWithAuth().delete(`/api/trips/${trip_id}/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Get from /api/trips/
export const getTrips = async () => {
    try {
        const response = await axiosWithAuth().get("/api/trips/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Post to /api/interests/
export const expressInterestInTrip = async (trip_id, userDetails) => {
    const body = {
        user_id: userDetails.id,
        trip_id: trip_id
    };

    try {
        const response = await axiosWithAuth().post("/api/interests/", body);
        return response.data;
    }
    catch (error) {
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
        if (error.response && error.response.status === 400) {
            const errorMessages = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`);
            return { status: 'error', errorMessages };
        }
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
        if (error.response && error.response.status === 400) {
            const errorMessages = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`);
            return { status: 'error', errorMessages };
        }
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
