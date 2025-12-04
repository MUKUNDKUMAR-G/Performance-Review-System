import api from './api';

const reviewService = {
    getAllReviews: async () => {
        const response = await api.get('/reviews');
        return response.data;
    },

    getReviewById: async (id) => {
        const response = await api.get(`/reviews/${id}`);
        return response.data;
    },

    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    updateReview: async (id, reviewData) => {
        const response = await api.put(`/reviews/${id}`, reviewData);
        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    },

    getReviewStats: async () => {
        const response = await api.get('/reviews/stats');
        return response.data;
    }
};

export default reviewService;