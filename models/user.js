const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/miniproject');

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    profilepic:{
        type: String,
        default: "default.jpg"
    }
})

module.exports = mongoose.model("user", userSchema);