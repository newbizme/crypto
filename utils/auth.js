const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config');

export function getUser (req) {
    if (!req.headers.authorization) {
        return { status: 401 };
    }

    const token = req.headers.authorization.split(' ')[1];
    
    // Decode the token using a secret key-phrase
    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        // The 401 code is for unauthorized status
        if (err) { return { status: 401 } }

        const userId = decoded.sub;
        console.log(userId);

        // Check if a user exists
        return User.findById(userId, (userErr, user) => {
            if (userErr || !user) {
                return { status: 401 }
            }

            return { status: 200, userId: userId };
        });
    });
}