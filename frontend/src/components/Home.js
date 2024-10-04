import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [debouncedQuery, setDebouncedQuery] = useState(""); 

  // Function to fetch movies from the API
  const fetchMovies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/movies`); 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMovies(data); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a movie from the API
  const deleteMovie = async (movieId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== movieId)
        );
      } else {
        console.error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  // Use effect to call fetchMovies when the component mounts
  useEffect(() => {
    fetchMovies();
  }, []);

  // Debounce effect for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); 
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleDelete = (id) => {
    deleteMovie(id); 
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Handle the loading state
  if (loading) {
    return <p>Loading movies...</p>;
  }

  // Handle error state
  if (error) {
    return <p>Error fetching movies: {error}</p>;
  }

  return (
    <section className="px-3 sm:px-8 py-2 sm:py-4">
      <h2 className="text-2xl sm:text-4xl text-gray-800 sm:mt-4 font-medium">
        The best movie reviews site!
      </h2>

      {/* Search input */}
      <div className="flex items-center justify-start gap-2 sm:my-4  py-0">
        <img className="w-6 h-6" src='/search.png' alt="search"/>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies by name"
          className="my-4 px-4 py-2 rounded border-2 w-full sm:w-1/2 border-purple-200 "
        />
      </div>

      <div className="flex gap-4 flex-wrap ">
        {filteredMovies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          filteredMovies.map((movie, index) => (
            <div
              key={index}
              className="w-96 mx-auto bg-purple-200 rounded-lg flex-grow py-4 sm:py-6 px-4 sm:px-6 relative flex-col flex gap-2 sm:gap-4"
            >
              <Link to={"/movie-details"} state={{ movieId: movie._id }}>
                <h3 className="text-xl">{movie.name}</h3>
              </Link>
              <p className="text-sm italic">
                Release Date: {movie.releaseDate}
              </p>
              <p>Rating: {movie.rating}/10</p>
              <div className="absolute right-4 bottom-4 flex gap-2">
                <Link to={"/movie-form"} state={movie}>
                  <img className="w-4 h-4" src="edit.png" alt="edit" />
                </Link>
                <button onClick={() => handleDelete(movie._id)}>
                  <img className="w-4 h-4" src="delete.png" alt="delete" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Home;
