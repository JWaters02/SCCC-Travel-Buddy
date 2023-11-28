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

export const getTrips = async () => {
    try {
        const response = await axiosWithAuth().get("/api/trips/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

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

export const reauthenticate = async () => {
    try {
        const response = await axiosWithAuth().get("/api/reauth/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
