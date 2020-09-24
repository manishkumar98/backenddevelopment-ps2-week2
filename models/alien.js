const mongoose = require('mongoose')


const alienSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    collegeid:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    
    tech: {
        type: String,
        required: true
    },
    sub: {
        type: Boolean,
        required: true,
        default: false
    },
    image:{
        type:String,
        required:true
    }


});

module.exports = mongoose.model('Alien',alienSchema)   
