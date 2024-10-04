// models/Movie.js
const mongoose = require('mongoose');

// Review schema (embedded inside movies)
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  }
});

// Movie schema
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    defaultValue:0
  },
  reviews: [reviewSchema] // Embedding the review schema as an array
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
