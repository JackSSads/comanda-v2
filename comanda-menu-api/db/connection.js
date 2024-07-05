const path = require('path');
const envPath = path.resolve(__dirname, '../../', '.env');
require("dotenv").config({ path: envPath });

const mongoose = require("mongoose");

const connection = mongoose.connect(process.env.MONGO_ATLAS);

module.exports = connection;