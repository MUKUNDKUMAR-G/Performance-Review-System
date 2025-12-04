import api from './api';

const assignmentService = {
    getReviewAssignments: async (reviewId) => {
        const response = await api.get(`/assignments/review/${reviewId}`);
        return response.data;
    },

    createAssignment: async (assignmentData) => {
        const response = await api.post('/assignments', assignmentData);
        return response.data;
    },

    deleteAssignment: async (id) => {
        const response = await api.delete(`/assignments/${id}`);
        return response.data;
    },
    
    getMyAssignments: async () => {
        const response = await api.get('/assignments/my-assignments');
        return response.data;
    }
};

export default assignmentService;