"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/Searchbar";

export default function ForYou() {
  const [books, setBooks] = useState<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Recommended
        const res = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
        );
        const data = await res.json();
        setBooks(data);

        // Selected
        const selectedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
        );
        const selectedData = await selectedRes.json();
        setSelectedBook(selectedData[0]);

        // Suggested
        const suggestedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
        );
        const suggestedData = await suggestedRes.json();
        setSuggestedBooks(suggestedData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Sidebar />
      <SearchBar />

      <div className="wrapper">
        <div className="row">
          <div className="container">

            {/* =========================
                Selected Just For You
            ========================= */}
            <div className="for-you__wrapper">
              <div className="for-you__title">Selected Just for You</div>

              {!selectedBook ? (
                <div className="selected__book--skeleton" />
              ) : (
                <div
                  className="selected__book"
                  onClick={() => router.push(`/book/${selectedBook.id}`)}
                >
                  {/* LEFT SIDE */}
                  <div className="selected__book--content">
                    <figure className="selected__img--mask">
                      <img
                        src={selectedBook.imageLink}
                        alt={selectedBook.title}
                        className="selected__img"
                      />
                    </figure>

                    <div className="selected__book--text">
                      <div className="selected__book--title">
                        {selectedBook.title}
                      </div>

                      <div className="selected__book--author">
                        {selectedBook.author}
                      </div>

                      {selectedBook.audioLink && (
                        <audio controls>
                          <source
                            src={selectedBook.audioLink}
                            type="audio/mpeg"
                          />
                        </audio>
                      )}
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="selected__book--sub-title">
                    {selectedBook.subTitle || "Recommended for you"}
                  </div>
                </div>
              )}
            </div>

            {/* =========================
                Recommended For You
            ========================= */}
            <div className="for-you__wrapper">
              <div className="for-you__title">Recommended For You</div>
              <div className="for-you__sub--title">
                We think you'll like these
              </div>

              {loading ? (
                <div className="recommended__books--skeleton-wrapper">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="recommended__books--skeleton">
                      <div className="skeleton" style={{ height: 180 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="for-you__recommended--books">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="for-you__recommended--books-link"
                      onClick={() => router.push(`/book/${book.id}`)}
                    >
                      {book.subscriptionRequired && (
                        <div className="book__premium-pill">Premium</div>
                      )}

                      <img
                        className="recommended__book--img"
                        src={book.imageLink}
                        alt={book.title}
                      />

                      <div className="recommended__book--title">
                        {book.title}
                      </div>

                      <div className="recommended__book--author">
                        {book.author}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =========================
                Suggested Books
            ========================= */}
            <div className="for-you__wrapper">
              <div className="for-you__title">Suggested Books</div>
              <div className="for-you__sub--title">
                Browse those books
              </div>

              {loading ? (
                <div className="recommended__books--skeleton-wrapper">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="recommended__books--skeleton">
                      <div className="skeleton" style={{ height: 180 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="for-you__recommended--books">
                  {suggestedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="for-you__recommended--books-link"
                      onClick={() => router.push(`/book/${book.id}`)}
                    >
                      {book.subscriptionRequired && (
                        <div className="book__premium-pill">Premium</div>
                      )}

                      <img
                        className="recommended__book--img"
                        src={book.imageLink}
                        alt={book.title}
                      />

                      <div className="recommended__book--title">
                        {book.title}
                      </div>

                      <div className="recommended__book--author">
                        {book.author}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}