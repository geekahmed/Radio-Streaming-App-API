const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const channelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    status: {
        type: Boolean,
        default: false
    },
    link:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Channels = mongoose.model('Channel', channelSchema);
module.exports = Channels;