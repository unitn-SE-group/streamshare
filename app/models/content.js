const mongoose = require(`mongoose`);

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'upload.files',
        required: true,
    },

    cover: {
       type: Buffer,
       required: true 
    }
})


export default contentSchema