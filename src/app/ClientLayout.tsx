"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = saved || (prefersDark ? "dark" : "light");
      setTheme(initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen">
      <header className="w-full flex items-center justify-between px-4 py-2 bg-base-100 shadow-md sticky top-0 z-40">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
          aria-label="Go to home page"
        >
          <span className="text-2xl">🎬</span>
          <span className="font-extrabold tracking-tight text-base-content">
            MovieDB
          </span>
        </Link>
        <form className="flex flex-1 justify-center" onSubmit={handleSearch}>
          <div className="join flex max-w-md w-full items-stretch">
            <input
              type="text"
              placeholder="Search movies..."
              className="input input-bordered join-item flex-1 min-w-0 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search movies"
            />
            <button
              className="btn btn-primary join-item flex items-center gap-1 min-h-0"
              type="submit"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>
        <button
          className="btn btn-ghost ml-2"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
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
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          ) : (
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
                d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95-7.07l-.71.71M4.05 4.93l-.71-.71"
              />
            </svg>
          )}
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}
