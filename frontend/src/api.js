import Cookies from 'js-cookie';

export const addTrip = async (item, userDetails) => {
    const token = Cookies.get('token');
    const { tripName, latitude, longitude, startDate, endDate } = item;

    const body = JSON.stringify({
        user_id: userDetails.id,
        trip_name: tripName,
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate
    });

    try {
        const response = await fetch("/api/trips/", {
            method: "POST",
            headers: {
                'Authorization': `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: body
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
