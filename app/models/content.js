const { ObjectId } = require("mongodb");
const mongoose = require(`mongoose`);

//Create the fileSchema
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
        required: true,
    },

    chunkSize: {
        type: Number, 
        required: true,
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

//Middleware used to ensure that when you upload a video, you may only specify either the UserId or the publishingId
fileSchema.pre(`validate`, (next) =>{
    if (this.contentType == `video`){
        if (!this.metadata.publishing_house && this.metadata.userId){
            next()
        }else{
            next(new Error('You are uploading a video, you only have to provide the userID as metadata!'));
        }
    } else if (this.contentType == `movie`) {
        if (this.metadata.publishing_house && !this.metadata.userId){
            next()
        }else{
            next(new Error('You are uploading a film, you only have to provide the publishing house!'));
        }
    } else{
        next(new Error('You are uploding something, make sure specify what you are uploading'));
    }
});

//Create the Chunk schema
const chunkSchema = new mongoose.Schema({
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true
    },
    n: { 
        type: Number,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    }
});

module.exports = mongoose.model("File", fileSchema);
module.exports = mongoose.model("Chunk", chunkSchema);
