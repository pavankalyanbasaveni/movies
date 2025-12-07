import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const runtime = "edge";

async function getMovie(id: string) {
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      : "";
  const res = await fetch(`${base}/api/tmdb/movie/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getSimilarMovies(id: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [movie, similar] = await Promise.all([
    getMovie(id),
    getSimilarMovies(id),
  ]);
  if (!movie || movie.status_code === 34) return notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Link
            href="/"
            className="btn btn-outline btn-secondary rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition mb-2 sm:mb-0 sm:mr-4 w-fit"
            aria-label="Back to Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold">Back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm text-left sm:text-left text-center sm:text-4xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="italic text-accent opacity-80 mt-1 text-lg text-left sm:text-left text-center">
                {movie.tagline}
              </p>
            )}
          </div>
        </div>
        <div className="w-full border-b border-base-300 mt-4"></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
              unoptimized
            />
          ) : (
            <div className="w-64 h-96 flex items-center justify-center bg-base-200 rounded-lg">
              No Image
            </div>
          )}
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-wrap gap-2 mb-2 justify-center lg:justify-start">
            {movie.genres?.map((g: { id: number; name: string }) => (
              <span key={g.id} className="badge badge-outline">
                {g.name}
              </span>
            ))}
          </div>
          <p className="mb-4 text-base opacity-80 text-center lg:text-left">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-4 text-sm mb-2 justify-center lg:justify-start">
            <span className="badge badge-secondary">
              Release: {movie.release_date}
            </span>
            <span className="badge badge-accent">⭐ {movie.vote_average}</span>
            <span className="badge">Runtime: {movie.runtime} min</span>
            <span className="badge">Status: {movie.status}</span>
          </div>
          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary mb-2 block"
            >
              Official Website
            </a>
          )}
          <div className="mb-2 text-sm">
            <span className="font-semibold">Budget:</span> $
            {movie.budget?.toLocaleString()}
            {" | "}
            <span className="font-semibold">Revenue:</span> $
            {movie.revenue?.toLocaleString()}
          </div>
          {movie.production_companies?.length > 0 && (
            <div className="mb-2 text-sm">
              <span className="font-semibold">Production Companies:</span>{" "}
              {movie.production_companies
                .map((c: { name: string }) => c.name)
                .join(", ")}
            </div>
          )}
          {movie.spoken_languages?.length > 0 && (
            <div className="mb-2 text-sm">
              <span className="font-semibold">Languages:</span>{" "}
              {movie.spoken_languages
                .map((l: { english_name: string }) => l.english_name)
                .join(", ")}
            </div>
          )}
        </div>
      </div>
      {similar.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similar
              .slice(0, 8)
              .map(
                (sim: {
                  id: number;
                  title: string;
                  poster_path: string;
                  vote_average: number;
                }) => (
                  <Link
                    href={`/movie/${sim.id}`}
                    key={sim.id}
                    className="no-underline"
                  >
                    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow h-full">
                      {sim.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${sim.poster_path}`}
                          alt={sim.title}
                          width={200}
                          height={300}
                          className="w-full h-40 object-cover rounded-t"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-base-200 rounded-t">
                          No Image
                        </div>
                      )}
                      <div className="card-body p-2">
                        <h3 className="card-title text-xs font-bold mb-1 line-clamp-2">
                          {sim.title}
                        </h3>
                        <div className="badge badge-secondary">
                          ⭐ {sim.vote_average}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
}
