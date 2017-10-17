const mongoose = require('mongoose');

// Define the Portfolio item model Schema
const PortfolioItemSchema = new mongoose.Schema({
    userID: String,
    title: String,
    url: String,
    images: [{
        preview: String,
        lastModified: Number,
        name: String,
        size: Number,
        type: String
    }],
    description: String,
    technologies: String,
    company: String
});

module.exports = mongoose.model('PortfolioItem', PortfolioItemSchema);