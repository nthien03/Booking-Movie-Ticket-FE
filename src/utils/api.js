import axios from '../utils/axios-customize';

/**
 * Module Auth
 */

export const callRegister = (name, email, password, age, gender, address) => {
    return axios.post('/api/v1/auth/register', { name, email, password, age, gender, address });
};

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password });
};

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account');
};

export const callRefreshToken = () => {
    return axios.get('/api/v1/auth/refresh');
};

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout');
};

/**
 * Module Movie
 */

export const callFetchMovies = (page, size, filter) => {
    return axios.get(`/api/v1/movies`, { params: { page, size, filter } });
};

export const callFetchMovieDetail = (movieId) => {
    return axios.get(`/api/v1/movies/${movieId}`);
};

export const callCreateMovie = (movieData) => axios.post('/api/v1/movies', movieData);
export const callUpdateMovie = (movieId, movieData) => axios.put(`/api/v1/movies/${movieId}`, movieData);

export const callFetchActors = (size) => {
    return axios.get('/api/v1/actors', { params: { size } });
}

export const callFetchGenres = (size) => {
    return axios.get('/api/v1/genres', { params: { size } });
}

export const callUploadSingleFile = (file, folderType) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const callFetchSchedules = (page, size, movieName, date) => {
    return axios.get(`/api/v1/schedules`, {
        params: { page, size, movieName, date }
    });
};

/**
 * Module Booking
 */

export const callSeat = (roomId, scheduleId) => {
    return axios.get(`/api/v1/seats/availability`, { params: { roomId, scheduleId } });
};

export const callCreateBooking = (totalPrice, amount, userId, paymentMethod) => {
    return axios.post('/api/v1/bookings', { totalPrice, amount, userId, paymentMethod });
};

export const callCreateTicket = (price, ticketCode, status, scheduleId, seatId, bookingId) => {
    return axios.post('/api/v1/tickets', { price, ticketCode, status, scheduleId, seatId, bookingId });
};

export const callVnpay = (amount, orderId) => {
    return axios.get(`/api/v1/payments/vn-pay`, { params: { amount, orderId } });
};

export const callFetchBookingHistory = (page, size, movieName) => {
    return axios.get(`/api/v1/bookings/history`, { params: { page, size, movieName } });
};

