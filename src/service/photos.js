const { ACCESS_KEY, BASE_URL } = require('@/constants');
const { default: axios } = require('axios');

const PHOTOS_BASE_URL = `${BASE_URL}/photos`;

export const getPhotos = async (page = 1, order_by = 'latest') => {
    try {
        const response = await axios.get(
            `${PHOTOS_BASE_URL}?page=${page}&per_page=10&order_by=${order_by}&client_id=${ACCESS_KEY}`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPhoto = async (photoId) => {
    try {
        const response = await axios.get(`${PHOTOS_BASE_URL}/${photoId}?client_id=${ACCESS_KEY}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const downloadPhoto = async (photoId) => {
    try {
        const response = await axios.get(`${PHOTOS_BASE_URL}/${photoId}/download?client_id=${ACCESS_KEY}`);
        return response.data;
    } catch (err) {
        throw err;
    }
};
