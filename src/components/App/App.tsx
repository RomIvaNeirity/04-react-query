import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isLoading && data && data.results.length === 0) {
      toast.error("No movies found.");
    }
  }, [data, isLoading]);

  const handleSubmit = (request: string) => {
    if (!request.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setQuery(request);
  };

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages || 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={(data?.page || 1) - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}

      {error && <ErrorMessage />}

      <MovieGrid movies={data?.results || []} onSelect={setSelectedMovie} />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster />
    </>
  );
}

export default App;
