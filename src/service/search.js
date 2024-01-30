import axios from 'axios';

const { BASE_URL, ACCESS_KEY } = require('@/constants');

const SEARCH_BASE_URL = `${BASE_URL}/search`;
export const searchPhotos = async (query, page = 1, collections, color) => {
    try {
        const respond = await axios.get(
            `${SEARCH_BASE_URL}/photos?client_id=${ACCESS_KEY}&query=${query}&page=${page}&collections=${collections}&color=${color}`,
        );
        return respond.data;
    } catch (err) {
        throw err;
    }
};

export const searchCollectionsOrUsers = async (type = 'users', page = 1) => {
    try {
        const respond = await axios.get(`${SEARCH_BASE_URL}/${type}?client_id=${ACCESS_KEY}&page=${page}&per_page=20`);
        return respond.data;
    } catch (err) {
        throw err;
    }
};
