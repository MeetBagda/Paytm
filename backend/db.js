const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://mjbagda035:paytm-clone-cluster@paytm-cluster.7k5ic.mongodb.net/")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase: true,
        minLength:3,
        maxLength:30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})