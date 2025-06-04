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
 * Module Booking
 */


