import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const AddEditReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { review, movie } = location.state || {};
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/movie-list`);
        const data = await response.json();
        setMovies(data);

        if (movie) {
          const selectedMovie = data.find((m) => m.name === movie.name);
          if (selectedMovie) {
            setValue('movieId', selectedMovie._id);
            setSelectedMovieId(selectedMovie._id); 
          }
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies(); 

    if (review) {
      setValue('name', review.name);
      setValue('rating', review.rating);
      setValue('comments', review.comments) 
    }
  }, [review, movie, setValue]);

  const handleMovieChange = (event) => {
    setValue('movieId', event.target.value); 
    setSelectedMovieId(event.target.value);  
  };

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      movieId: selectedMovieId, 
    };

    if (review) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/movies/${finalData.movieId}/reviews/${review._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
        .then((response) => {
          if (response.ok) {
            alert('Review updated successfully!');
            reset();
            navigate(`/movie-details`, { state: { movieId: finalData.movieId } });
          } else {
            throw new Error('Failed to update review');
          }
        })
        .catch((error) => {
          console.error('Error updating review:', error);
        });
    } else {
      // Add new review
      fetch(`${process.env.REACT_APP_BACKEND_URL}/movies/${finalData.movieId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
        .then((response) => {
          if (response.ok) {
            alert('Review added successfully!');
            reset();
            navigate(`/movie-details`, { state: { movieId: finalData.movieId } });
          } else {
            throw new Error('Failed to add review');
          }
        })
        .catch((error) => {
          console.error('Error adding review:', error);
        });
    }
  };

  return (
    <div className="p-5 border rounded shadow-md w-full sm:w-96 mx-auto mt-10">
      <h2 className="mb-4 font-bold text-lg">{review ? 'Edit Review' : 'Add New Review'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <select
            {...register('movieId', { required: 'Please select a movie' })}
            className="border p-2 w-full"
            value={selectedMovieId} 
            onChange={handleMovieChange}
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.name}
              </option>
            ))}
          </select>
          {errors.movieId && <p className="text-red-500">{errors.movieId.message}</p>}
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your name"
            {...register('name', { required: 'Your name is required' })}
            className="border p-2 w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <input
            type="number"
            step="0.1"
            placeholder="Rating out of 10"
            {...register('rating', {
              required: 'Rating is required',
              min: { value: 0, message: 'Minimum rating is 0' },
              max: { value: 10, message: 'Maximum rating is 10' },
            })}
            className="border p-2 w-full"
          />
          {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Review comments"
            {...register('comments', { required: 'Review comments are required' })}
            className="border p-2 w-full"
          />
          {errors.comments && <p className="text-red-500">{errors.comments.message}</p>}
        </div>
        <div className="flex justify-end">
        <button type="submit" className="bg-purple-500 text-white p-2 rounded">
          {review ? 'Update Review' : 'Add Review'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditReview;
