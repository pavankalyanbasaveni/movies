import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
