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

export const callCreateMovie = (movieName, director, actors, description, poster, trailerUrl, duration, genres, releaseDate, ageRestriction, status) => {
    return axios.post('/api/v1/movies', {
        movieName, director, actors, description, poster, trailerUrl, duration, genres, releaseDate, ageRestriction, status
    });
};

export const callUpdateMovie = (movieId, movieName, director, actors, description, poster, trailerUrl, duration, genres, releaseDate, ageRestriction, status) => {
    return axios.put(`/api/v1/movies/${movieId}`, {
        movieName, director, actors, description, poster, trailerUrl, duration, genres, releaseDate, ageRestriction, status
    });

};

export const callFetchActors = () => {
    return axios.get('/api/v1/actors');
}

export const callFetchGenres = () => {
    return axios.get('/api/v1/genres');
}

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

