import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.TMDB_API_KEY;
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get("genreId");
  const page = searchParams.get("page") || "1";
  if (!genreId) {
    return NextResponse.json({ error: "Missing genreId" }, { status: 400 });
  }
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
