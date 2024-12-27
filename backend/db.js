const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('')

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
})

const User = mongoose.model('User', userSchema);
