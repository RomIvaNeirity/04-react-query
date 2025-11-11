import { useState } from "react";
import "./App.module.css";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setError] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = async (request: string) => {
    if (!request.trim()) {
      setMovies([]);
      toast.error("Please enter your search query.");
      return;
    }
    setError(false);
    setMovies([]);
    setIsLoad(true);

    try {
      const results = await fetchMovies(request);
      setError(false);
      if (results.length === 0) {
        toast.error("No movies found.");
        return;
      }

      setMovies(results);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoad(false);
    }
  };

  const onSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={onSelect} />}
      {isError && <ErrorMessage />}
      {isLoad && <Loader />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      <Toaster />
    </>
  );
}

export default App;
