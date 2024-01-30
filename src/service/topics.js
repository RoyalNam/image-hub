import axios from 'axios';

const { BASE_URL, ACCESS_KEY } = require('@/constants');

const TOPICS_BASE_URL = `${BASE_URL}/topics`;

export const getTopics = async (page = 1, order_by = 'position') => {
    try {
        const respond = await axios.get(`${TOPICS_BASE_URL}?client_id=${ACCESS_KEY}&page=${page}&order_by=${order_by}`);
        return respond.data;
    } catch (err) {
        throw err;
    }
};

export const getTopic = async (id_or_slug) => {
    try {
        const respond = await axios.get(`${TOPICS_BASE_URL}/${id_or_slug}?client_id=${ACCESS_KEY}`);
        return respond.data;
    } catch (error) {
        throw error;
    }
};

// latest | oldest | popular
export const getTopicPhotos = async (id_or_slug, page = 1, order_by = 'latest') => {
    try {
        const respond = await axios.get(
            `${TOPICS_BASE_URL}/${id_or_slug}/photos?client_id=${ACCESS_KEY}&page=${page}&order_by=${order_by}`,
        );
        return respond.data;
    } catch (error) {
        throw error;
    }
};
