const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/database');


exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at 
             FROM users 
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at 
             FROM users 
             WHERE id = ?`,
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, role, is_active } = req.body;

        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await db.query(
            `INSERT INTO users (email, password, first_name, last_name, role, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, first_name, last_name, role || 'employee', is_active !== undefined ? is_active : true]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: result.insertId,
                email,
                first_name,
                last_name,
                role: role || 'employee',
                is_active: is_active !== undefined ? is_active : true
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const userId = req.params.id;
        const { email, first_name, last_name, role, password } = req.body;

        // Check if user exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const updates = [];
        const values = [];

        if (email) {
            const [emailCheck] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, userId]
            );
            if (emailCheck.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            updates.push('email = ?');
            values.push(email);
        }

        if (first_name) {
            updates.push('first_name = ?');
            values.push(first_name);
        }

        if (last_name) {
            updates.push('last_name = ?');
            values.push(last_name);
        }

        if (role) {
            updates.push('role = ?');
            values.push(role);
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(userId);

        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const [updatedUser] = await db.query(
            'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser[0]
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }


        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { is_active } = req.body;

        if (is_active === undefined) {
            return res.status(400).json({
                success: false,
                message: 'is_active field is required'
            });
        }

        const [existingUsers] = await db.query(
            'SELECT id, first_name, last_name FROM users WHERE id = ?',
            [userId]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await db.query(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [is_active, userId]
        );

        res.json({
            success: true,
            message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: userId,
                is_active
            }
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};