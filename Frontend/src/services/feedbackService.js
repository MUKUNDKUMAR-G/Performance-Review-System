import api from './api';

const feedbackService = {
    getMyAssignments: async () => {
        const response = await api.get('/feedback/my-assignments');
        return response.data;
    },

    getAssignmentDetails: async (assignmentId) => {
        const response = await api.get(`/feedback/assignment/${assignmentId}`);
        return response.data;
    },

    submitFeedback: async (feedbackData) => {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
    },

    updateFeedback: async (id, feedbackData) => {
        const response = await api.put(`/feedback/${id}`, feedbackData);
        return response.data;
    },

    getReviewFeedback: async (reviewId) => {
        const response = await api.get(`/feedback/review/${reviewId}`);
        return response.data;
    },

    deleteFeedback: async (id) => {
        const response = await api.delete(`/feedback/${id}`);
        return response.data;
    }
};

export default feedbackService;