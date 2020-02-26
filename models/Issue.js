const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create the User Schema
const UserSchema = new Schema({
    
    username:{
        type:String,
        required:true
    },
    description_of_issue:{
        type:String,
        required:true
    },
    solution:{
        type:String,
        default:""
    },
    doctor:{
        type:String,
        default:""
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Issue = mongoose.model('issue', UserSchema);