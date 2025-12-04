const db = require('../config/database');

class Assignment {
    static async getByReview(reviewId) {
        const [assignments] = await db.query(`
            SELECT 
                ra.*,
                CONCAT(u.first_name, ' ', u.last_name) as reviewer_name,
                u.email as reviewer_email
            FROM review_assignments ra
            JOIN users u ON ra.reviewer_id = u.id
            WHERE ra.review_id = ?
            ORDER BY ra.created_at DESC
        `, [reviewId]);
        return assignments;
    }

    static async getById(id) {
        const [assignments] = await db.query(`
            SELECT 
                ra.*,
                CONCAT(u.first_name, ' ', u.last_name) as reviewer_name,
                u.email as reviewer_email,
                pr.review_period,
                pr.employee_id,
                CONCAT(emp.first_name, ' ', emp.last_name) as employee_name
            FROM review_assignments ra
            JOIN users u ON ra.reviewer_id = u.id
            JOIN performance_reviews pr ON ra.review_id = pr.id
            JOIN users emp ON pr.employee_id = emp.id
            WHERE ra.id = ?
        `, [id]);
        return assignments[0];
    }

    static async getByReviewer(reviewerId) {
        const [assignments] = await db.query(`
            SELECT 
                ra.*,
                pr.review_period,
                pr.status as review_status,
                CONCAT(emp.first_name, ' ', emp.last_name) as employee_name,
                emp.email as employee_email
            FROM review_assignments ra
            JOIN performance_reviews pr ON ra.review_id = pr.id
            JOIN users emp ON pr.employee_id = emp.id
            WHERE ra.reviewer_id = ?
            ORDER BY ra.created_at DESC
        `, [reviewerId]);
        return assignments;
    }

    static async create(reviewId, reviewerId) {
        try {
            const [result] = await db.query(
                `INSERT INTO review_assignments (review_id, reviewer_id, status) 
                 VALUES (?, ?, 'pending')`,
                [reviewId, reviewerId]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('This reviewer is already assigned to this review');
            }
            throw error;
        }
    }


    static async exists(reviewId, reviewerId) {
        const [rows] = await db.query(
            'SELECT id FROM review_assignments WHERE review_id = ? AND reviewer_id = ?',
            [reviewId, reviewerId]
        );
        return rows.length > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM review_assignments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE review_assignments SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async getReviewStats(reviewId) {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted
            FROM review_assignments
            WHERE review_id = ?
        `, [reviewId]);
        return stats[0];
    }
}

module.exports = Assignment;