const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
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
    }
}, {
    timestamps: true
});

const Categories = mongoose.model('Category', categorySchema);
module.exports = Categories;