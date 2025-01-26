const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        require : true,
        trim: true,
    },
    email:{
        type : String,
        require : true,
        unique: true,
    },
    password:{
        type : String,
        require : true,
    },
    googleId:{
        type: String,
        unique: true,
        sparse: true
    },
})

module.exports = mongoose.model('User',userSchema);