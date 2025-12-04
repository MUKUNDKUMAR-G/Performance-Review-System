const db = require('../config/database');

class Review {
    static async getAll() {
        const [reviews] = await db.query(`
            SELECT 
                pr.*,
                CONCAT(u.first_name, ' ', u.last_name) as employee_name,
                u.email as employee_email,
                CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
            FROM performance_reviews pr
            JOIN users u ON pr.employee_id = u.id
            JOIN users creator ON pr.created_by = creator.id
            ORDER BY pr.created_at DESC
        `);
        return reviews;
    }

    static async getById(id) {
        const [reviews] = await db.query(`
            SELECT 
                pr.*,
                CONCAT(u.first_name, ' ', u.last_name) as employee_name,
                u.email as employee_email,
                CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
            FROM performance_reviews pr
            JOIN users u ON pr.employee_id = u.id
            JOIN users creator ON pr.created_by = creator.id
            WHERE pr.id = ?
        `, [id]);
        return reviews[0];
    }

    static async getByEmployee(employeeId) {
        const [reviews] = await db.query(`
            SELECT 
                pr.*,
                CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
            FROM performance_reviews pr
            JOIN users creator ON pr.created_by = creator.id
            WHERE pr.employee_id = ?
            ORDER BY pr.created_at DESC
        `, [employeeId]);
        return reviews;
    }

    static async create(data) {
        const [result] = await db.query(
            `INSERT INTO performance_reviews (employee_id, review_period, status, created_by) 
             VALUES (?, ?, ?, ?)`,
            [data.employee_id, data.review_period, data.status || 'draft', data.created_by]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const updates = [];
        const values = [];

        if (data.employee_id !== undefined) {
            updates.push('employee_id = ?');
            values.push(data.employee_id);
        }
        if (data.review_period !== undefined) {
            updates.push('review_period = ?');
            values.push(data.review_period);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
        }

        if (updates.length === 0) return false;

        values.push(id);
        await db.query(
            `UPDATE performance_reviews SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return true;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM performance_reviews WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM performance_reviews
        `);
        return stats[0];
    }
}

module.exports = Review;