"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    console.log("movie id==>", encodeURIComponent(query));
    fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.results || []))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Search Results for {query}</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-40">
          Loading...
        </div>
      ) : results.length === 0 ? (
        <div className="text-center opacity-70">No results found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {results.map((movie) => (
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
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="flex justify-center items-center min-h-40">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
