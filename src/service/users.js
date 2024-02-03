const { BASE_URL, ACCESS_KEY } = require('@/constants');
const { default: axios } = require('axios');

const USERS_BASE_URL = `${BASE_URL}/users`;

export const getUserProfile = async (username) => {
    try {
        const response = await axios.get(`${USERS_BASE_URL}/${username}?client_id=${ACCESS_KEY}`);
        return response.data;
    } catch (err) {
        throw err;
    }
};

// photos | likes | collections
export const getUserMedia = async ({ mediaType = 'photos', username, page = 1, orderBy = 'latest' }) => {
    try {
        const response = await axios.get(`${USERS_BASE_URL}/${username}/${mediaType}`, {
            params: {
                client_id: ACCESS_KEY,
                page: page,
                per_page: 20,
                order_by: orderBy,
            },
        });
        return response.data;
    } catch (err) {
        throw err;
    }
};
