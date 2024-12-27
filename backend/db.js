const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50,
    },
    firstname: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
})

const accountSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {User, Account};