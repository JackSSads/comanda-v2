const path = require('path');
const envPath = path.resolve(__dirname, '../../', '.env');
require("dotenv").config({ path: envPath });

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.cookie.split('Authorization=')[1];

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error("User not found");
        };

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({ error, message: "Erro ao autenticar" });
    };
};

module.exports = auth;