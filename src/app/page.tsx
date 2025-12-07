"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const MOVIES_PER_PAGE = 8;

export default function Home() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<Record<number, Movie[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [pageByGenre, setPageByGenre] = useState<Record<number, number>>({});
  const [loadingMore, setLoadingMore] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchGenresAndMovies() {
      setLoading(true);
      const genresRes = await fetch("/api/tmdb/genres");
      const genresData = await genresRes.json();
      setGenres(genresData.genres || []);
      const movies: Record<number, Movie[]> = {};
      const pages: Record<number, number> = {};
      await Promise.all(
        (genresData.genres || []).map(async (genre: Genre) => {
          const moviesRes = await fetch(
            `/api/tmdb/movies?genreId=${genre.id}&page=1`
          );
          const moviesData = await moviesRes.json();
          movies[genre.id] =
            moviesData.results?.slice(0, MOVIES_PER_PAGE) || [];
          pages[genre.id] = 1;
        })
      );
      setMoviesByGenre(movies);
      setPageByGenre(pages);
      setLoading(false);
    }
    fetchGenresAndMovies();
  }, []);

  const handleLoadMore = async (genreId: number) => {
    setLoadingMore((prev) => ({ ...prev, [genreId]: true }));
    const nextPage = (pageByGenre[genreId] || 1) + 1;
    const res = await fetch(
      `/api/tmdb/movies?genreId=${genreId}&page=${nextPage}`
    );
    const data = await res.json();
    setMoviesByGenre((prev) => ({
      ...prev,
      [genreId]: [...(prev[genreId] || []), ...(data.results || [])],
    }));
    setPageByGenre((prev) => ({ ...prev, [genreId]: nextPage }));
    setLoadingMore((prev) => ({ ...prev, [genreId]: false }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Movies by Genre</h1>
        <div className="flex flex-col gap-12">
          {[...Array(3)].map((_, genreIdx) => (
            <div key={genreIdx}>
              <div className="h-7 w-48 mb-4 bg-base-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="card bg-base-100 shadow-md h-full animate-pulse"
                  >
                    <div className="w-full h-60 bg-base-200 rounded-t" />
                    <div className="card-body p-4">
                      <div className="h-5 w-32 bg-base-200 rounded mb-2" />
                      <div className="h-3 w-20 bg-base-200 rounded mb-1" />
                      <div className="h-4 w-12 bg-base-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <div className="btn btn-outline btn-primary w-32 h-10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Movies by Genre</h1>
      <div className="flex flex-col gap-12">
        {genres.map((genre) => (
          <div key={genre.id}>
            <h2 className="text-2xl font-semibold mb-4">{genre.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {moviesByGenre[genre.id]?.map((movie) => (
                <Link
                  href={`/movie/${movie.id}`}
                  key={movie.id}
                  className="no-underline"
                >
                  <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow h-full">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={400}
                        className="w-full h-60 object-cover rounded-t"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-60 flex items-center justify-center bg-base-200 rounded-t">
                        No Image
                      </div>
                    )}
                    <div className="card-body p-4">
                      <h3 className="card-title text-base font-bold mb-2 line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-xs opacity-70 mb-1">
                        {movie.release_date}
                      </p>
                      <div className="badge badge-secondary">
                        ⭐ {movie.vote_average}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => handleLoadMore(genre.id)}
                disabled={loadingMore[genre.id]}
              >
                {loadingMore[genre.id] ? "Loading..." : "Load More"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
