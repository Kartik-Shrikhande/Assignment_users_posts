const mongoose = require('mongoose');

const userSchemas = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    mobile: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, { timestamps: true })


module.exports = mongoose.model('user', userSchemas)