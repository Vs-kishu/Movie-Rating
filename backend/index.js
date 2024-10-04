const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./modal/movies.js'); 
const cors = require('cors'); 
require('dotenv').config();  // Load environment variables from .env

const { calculateAverageRating } = require('./utils/utils.js');

const app = express();

// CORS Options
const corsOptions = {
  origin: ['https://movie-rating-client-dusky.vercel.app', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions)); 
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ _id: -1 }); 
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get a Movie
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const movie = await Movie.findById(id); 
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie); 
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
});


app.get('/movie-list', async (req, res) => {
  try {
    const movies = await Movie.find({}, 'name _id'); 
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add a new movie
app.post('/movies', async (req, res) => {
  const movie = new Movie({
    name: req.body.name,
    releaseDate: req.body.releaseDate,
    rating: 0
  });
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit a movie
app.put('/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review to a movie
app.post('/movies/:id/reviews', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Add the new review
    movie.reviews.push(req.body);

    // Recalculate the average rating
    movie.rating = calculateAverageRating(movie.reviews);

    // Save the movie with the new review and updated rating
    await movie.save();

    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Edit a review in a movie
app.put('/movies/:id/reviews/:reviewId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const review = movie.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.set(req.body);

    movie.rating = calculateAverageRating(movie.reviews);

    await movie.save();

    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete a review from a movie
app.delete('/movies/:id/reviews/:reviewId', async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const result = await Movie.updateOne(
      { _id: id },
      { $pull: { reviews: { _id: reviewId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Review not found or already deleted." });
    }

    const movie = await Movie.findById(id);
    
    if (movie.reviews.length > 0) {
      movie.rating = calculateAverageRating(movie.reviews);
    } else {
      movie.rating = 0; 
    }

    await movie.save();

    res.json({ message: "Review deleted and rating updated successfully!", movie });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: error.message || "An error occurred" });
  }
});






// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
