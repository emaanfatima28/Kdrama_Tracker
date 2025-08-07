const mongoose = require('mongoose');

const dramaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    genre:{type: String, required: true},
    year: { type: Number, required: true },
    coverImg: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Drama', dramaSchema);
