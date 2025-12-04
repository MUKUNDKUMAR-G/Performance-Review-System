const jwt = require('jsonwebtoken');

const generateToken = (userId, email, role) => {
    return jwt.sign(
        { 
            id: userId, 
            email: email,
            role: role 
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: '1d' 
        }
    );
};

module.exports = generateToken;