import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MovieDetails = () => {
  const { state } = useLocation();
  const { movieId } = state; 
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch movie details based on the movie ID when the component mounts
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data); // Set the movie details
        setReviews(data.reviews);

      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);


  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}/reviews/${reviewId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );

      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <section className="px-3 sm:px-8 py-2 sm:py-4">
      <div className="flex justify-between text-3xl sm:text-5xl">
        <p>Title: {movie.name}</p>
        <p className="text-purple-500">
          {movie.rating ? `${movie.rating}/10` : "no"}
        </p>
      </div>
      <div className="mt-8  space-y-4 sm:space-y-6">
        {reviews.length > 0
          ? reviews.map((review) => (
              <div
                key={review._id}
                className="border-2 border-gray-200 pl-4 sm:pl-8 pr-4 py-2 sm:py-4 flex flex-col gap-3 sm:gap-4"
              >
                <p className="flex justify-between font-medium">
                  {review.comments}{" "}
                  <span className="text-purple-500">{review.rating}/10</span>
                </p>
                <div className="flex items-center justify-between">
                  <span className="italic">By {review.name}</span>
                  <div className="flex gap-2">
                    <Link
                      to="/review-form"
                      state={{ review, movie }}
                    >
                      <img className="w-4 h-4" src="edit.png" alt="edit" />
                    </Link>
                    <button onClick={() => deleteReview(review._id)}>
                      <img className="w-4 h-4" src="delete.png" alt="delete" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          : "No reviews yet!"}
      </div>
    </section>
  );
};

export default MovieDetails;
