"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // debounce search by 300ms
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Use the new API for author OR title search
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(value)}`
        );
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelectBook = (book: any) => {
    router.push(book.audioLink ? `/player/${book.id}` : `/book/${book.id}`);
    setResults([]);
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="search__background">
      <div className="search__wrapper">
        <div className="search__content">
          <div className="search">
            <div className="search__input--wrapper">

              <input
                className="search__input"
                placeholder="Search for books"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* SEARCH ICON / LOADING SPINNER */}
              <div className="search__icon">
                {loading ? (
                  <div className="search__spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.36 5.61 12.28 2.5 8.5 2.5S1.64 5.61 1.64 9.39c0 3.78 3.09 6.87 6.87 6.87a6.471 6.471 0 005.34-1.48l.27.28v.79l4.25 4.25 1.5-1.5L15.5 14zM8.5 14c-2.53 0-4.61-2.08-4.61-4.61S5.97 4.78 8.5 4.78s4.61 2.08 4.61 4.61S11.03 14 8.5 14z"
                      fill="#03314b"
                    />
                  </svg>
                )}
              </div>

              {/* CLEAR BUTTON */}
              {query && (
                <div className="search__delete--icon" onClick={clearSearch}>
                  ×
                </div>
              )}

              {/* DROPDOWN RESULTS */}
              {results.length > 0 && (
                <div className="search__books--wrapper">
                  {results.map((book) => (
                    <div
                      key={book.id}
                      className="search__book--link"
                      onClick={() => handleSelectBook(book)}
                    >
                      <div className="search__book--img-mask">
                        <img
                          className="search__book--img"
                          src={book.imageLink}
                          alt={book.title}
                        />
                      </div>

                      <div>
                        <div className="search__book--title">{book.title}</div>
                        <div className="search__book--author">{book.author}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* INLINE CSS FOR SPINNER */}
      <style jsx>{`
        .search__spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ccc;
          border-top: 2px solid #03314b;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}