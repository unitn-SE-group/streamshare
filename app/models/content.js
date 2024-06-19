const { ObjectId } = require("mongodb");
const mongoose = require(`mongoose`);

const fileSchema = new mongoose.Schema({
    //The name of the file
    filename: {
        type: String,
        required: true
    },

    contentType: {
        type: String,
        enum: ['movie','video'],
        required: true,
    },

    length: {
        type: Number,
        require: true,
    },

    chunkSize: {
        type: Number, 
        require: true,
    },

    uploadDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    metadata: {
        userId: {
            ObjectId,
            required: false,
        },
        publishing_house: {
            String,
            required: false
        }
    }
})

fileSchema.pre(`validate`, (next) =>{
    if (this.contentType == `video` && !this.metadata.userId){
        
    }
});