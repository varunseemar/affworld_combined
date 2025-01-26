const mongoose = require('mongoose')

const storySchema = new mongoose.Schema(
    {
        heading:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        imageUrl:{
            type: String,
            required: true,
        },
        creator:{
            type: String,
            required: true,
        },
    },
);

module.exports = mongoose.model('StorySchema',storySchema);