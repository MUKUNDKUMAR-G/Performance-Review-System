const db = require('../config/database');

class Feedback {
    static async getByAssignment(assignmentId) {
        const [feedback] = await db.query(
            'SELECT * FROM feedback WHERE assignment_id = ?',
            [assignmentId]
        );
        return feedback[0];
    }

    static async getById(id) {
        const [feedback] = await db.query(`
            SELECT 
                f.*,
                ra.reviewer_id,
                ra.review_id,
                CONCAT(reviewer.first_name, ' ', reviewer.last_name) as reviewer_name,
                CONCAT(employee.first_name, ' ', employee.last_name) as employee_name,
                pr.review_period
            FROM feedback f
            JOIN review_assignments ra ON f.assignment_id = ra.id
            JOIN users reviewer ON ra.reviewer_id = reviewer.id
            JOIN performance_reviews pr ON ra.review_id = pr.id
            JOIN users employee ON pr.employee_id = employee.id
            WHERE f.id = ?
        `, [id]);
        return feedback[0];
    }
    static async getByReview(reviewId) {
        const [feedback] = await db.query(`
            SELECT 
                f.*,
                ra.reviewer_id,
                CONCAT(reviewer.first_name, ' ', reviewer.last_name) as reviewer_name,
                reviewer.email as reviewer_email
            FROM feedback f
            JOIN review_assignments ra ON f.assignment_id = ra.id
            JOIN users reviewer ON ra.reviewer_id = reviewer.id
            WHERE ra.review_id = ?
            ORDER BY f.submitted_at DESC
        `, [reviewId]);
        return feedback;
    }

    static async create(assignmentId, answers) {
        const [result] = await db.query(
            'INSERT INTO feedback (assignment_id, answers) VALUES (?, ?)',
            [assignmentId, JSON.stringify(answers)]
        );
        return result.insertId;
    }

    static async update(id, answers) {
        const [result] = await db.query(
            'UPDATE feedback SET answers = ? WHERE id = ?',
            [JSON.stringify(answers), id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM feedback WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async existsForAssignment(assignmentId) {
        const [rows] = await db.query(
            'SELECT id FROM feedback WHERE assignment_id = ?',
            [assignmentId]
        );
        return rows.length > 0;
    }
}

module.exports = Feedback;