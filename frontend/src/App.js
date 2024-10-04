import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import AddEditMovie from './components/AddEditMovie.js';
import AddEditReview from './components/AddEditReview.js';


const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
         <Route path="/" element={<Home />} />
        <Route path="/movie-details" element={<MovieDetails />} /> 
        <Route path="/movie-form" element={<AddEditMovie />} /> 
        <Route path="/review-form" element={<AddEditReview />} /> 

      </Routes>
    </Router>
  );
};

export default App;
