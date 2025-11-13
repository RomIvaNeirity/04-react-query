import axios from "axios";
import type { Movie } from "../../src/types/movie";

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

export async function fetchMovies(query: string, page = 1): Promise<TMDBResponse> {
  const response = await axios.get<TMDBResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query, page },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

 
  return {
    page: response.data.page,
    total_pages: response.data.total_pages,
    results: response.data.results,
  };
}
