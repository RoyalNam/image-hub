import axios from 'axios';

const { BASE_URL, ACCESS_KEY } = require('@/constants');

const SEARCH_BASE_URL = `${BASE_URL}/search`;
export const searchPhotos = async ({ query, page = 1, collections, color }) => {
    try {
        const respond = await axios.get(`${SEARCH_BASE_URL}/photos`, {
            params: {
                client_id: ACCESS_KEY,
                query: query,
                page: page,
                per_page: 20,
                collections: collections,
                color: color,
            },
        });
        return respond.data.results;
    } catch (err) {
        throw err;
    }
};

// Get One
export const searchCollectionsOrUsers = async ({ type = 'users', per_page = 10, query, page = 1 }) => {
    try {
        const respond = await axios.get(`${SEARCH_BASE_URL}/${type}`, {
            params: {
                client_id: ACCESS_KEY,
                query: query,
                page: page,
                per_page: per_page,
            },
        });
        return respond.data.results;
    } catch (err) {
        throw err;
    }
};
