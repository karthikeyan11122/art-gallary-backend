const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
    name: String,
    price: Number,
    imageUrl: String
});

const Painting = mongoose.model('Painting', paintingSchema);
module.exports = Painting;
