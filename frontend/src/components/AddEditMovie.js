import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

const AddEditMovie = () => {
    const{state:movie}=useLocation()
  const navigate = useNavigate();

  const {
    register: registerMovie,
    handleSubmit: handleMovieSubmit,
    formState: { errors: movieErrors },
    reset: resetMovieForm,
  } = useForm({
    defaultValues: movie || {
      name: "",
      releaseDate: "",
    },
  });

  // Populate form with movie data if editing
  useEffect(() => {
    if (movie) {
      resetMovieForm(movie);
    }
  }, [movie, resetMovieForm]);

  // Function to handle form submission (POST for add, PUT for edit)
  const onSubmitMovie = async (data) => {
    const apiUrl = movie
      ? `${process.env.REACT_APP_BACKEND_URL}/movies/${movie._id}` 
      : `${process.env.REACT_APP_BACKEND_URL}/movies`; 

    const method = movie ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const message = movie
          ? "Movie updated successfully!"
          : "Movie added successfully!";
        alert(message);
        resetMovieForm();
        navigate("/"); 
      } else {
        alert("Failed to save movie");
      }
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };



  return (
    <div className="p-5 border rounded shadow-md w-full sm:w-96 h-full mx-auto bg-white relative mt-8">
      <h2 className="mb-4 font-bold text-lg">
        {movie ? "Edit Movie" : "Add New Movie"}
      </h2>
   
      <form onSubmit={handleMovieSubmit(onSubmitMovie)}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            {...registerMovie("name", { required: "Movie name is required" })}
            className="border p-2 w-full"
          />
          {movieErrors.name && (
            <p className="text-red-500">{movieErrors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="date"
            placeholder="Release date"
            {...registerMovie("releaseDate", {
              required: "Release date is required",
            })}
            className="border p-2 w-full"
          />
          {movieErrors.releaseDate && (
            <p className="text-red-500">{movieErrors.releaseDate.message}</p>
          )}
        </div>
        
       <div className="flex justify-end"> <button type="submit" className="bg-purple-500 text-white p-2 rounded">
          {movie ? "Update Movie" : "Create Movie"}
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditMovie;
