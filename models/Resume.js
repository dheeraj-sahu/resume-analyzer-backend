const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    filename:{
        type: String,
        required: true,
    },
    parseFields:{
        name:{
            type: String,
            default:'',
        },
        email:{
            type: String,
            default:'',

        },
        phone:{
            type:String,
            default:'',
        },
        linkedin:{
            type: String,
            default:'',
        },
        skills:{
            type: [String],
            default:[],
        },
        experience:{
            type: String,
            default: '',
        },
        education:{
            type:String,
            default:'',
        },
    },
    uploadDate:{
        type: Date,
        default: Date.now,
    },
});

module.exports=mongoose.model('Resume',ResumeSchema);