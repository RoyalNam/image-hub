import { ACCESS_KEY, BASE_URL } from '@/constants';
import axios from 'axios';

const COLLECTIONS_BASE_URL = `${BASE_URL}/collections`;

export const getCollections = async (page = 1) => {
    try {
        const respond = await axios.get(`${COLLECTIONS_BASE_URL}?client_id=${ACCESS_KEY}&per_page=30&page=${page}`);
        return respond.data;
    } catch (err) {
        throw err;
    }
};

export const getCollection = async (id) => {
    try {
        const respond = await axios.get(`${COLLECTIONS_BASE_URL}/${id}?client_id=${ACCESS_KEY}`);
        return respond.data;
    } catch (err) {
        throw err;
    }
};

export const getCollectionPhotos = async (id, page = 1) => {
    try {
        const respond = await axios.get(`${COLLECTIONS_BASE_URL}/${id}/photos?client_id=${ACCESS_KEY}&page=${page}`);
        return respond.data;
    } catch (err) {
        throw err;
    }
};
