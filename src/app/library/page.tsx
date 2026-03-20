"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/Searchbar";

import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type BookData = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null);
  const [savedBooks, setSavedBooks] = useState<BookData[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setSavedBooks([]);
        setFinishedBooks([]);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        const data = snapshot.exists() ? snapshot.data() : {};

        setSavedBooks(data.savedBooks || []);
        setFinishedBooks(data.finishedBooks || []);
      } catch (err) {
        console.error("Firestore error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <>
        <Sidebar />
        <SearchBar />
        <div style={{ padding: "24px" }}>
          <p>You must be logged in to view your Library.</p>
        </div>
      </>
    );
  }

  
  return (
    <>
      <Sidebar />
      <SearchBar />

      <div className="wrapper">
        <div className="row">
          <div className="container">

            
            <div className="library__section">
              <h2 className="library__title">Saved Books</h2>
              {loading ? (
                <div className="library__books--skeleton">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ width: 150, height: 200, marginRight: 16 }} />
                  ))}
                </div>
              ) : savedBooks.length === 0 ? (
                <p>No saved books yet. Go add some!</p>
              ) : (
                <div className="library__books--wrapper">
                  {savedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="library__book"
                      onClick={() => router.push(`/book/${book.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={book.imageLink}
                        alt={book.title}
                        className="library__book--img"
                      />
                      <div className="library__book--title">{book.title}</div>
                      <div className="library__book--author">{book.author}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

           
            <div className="library__section" style={{ marginTop: "48px" }}>
              <h2 className="library__title">Finished Books</h2>
              {loading ? (
                <div className="library__books--skeleton">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ width: 150, height: 200, marginRight: 16 }} />
                  ))}
                </div>
              ) : finishedBooks.length === 0 ? (
                <p>You haven't finished any books yet.</p>
              ) : (
                <div className="library__books--wrapper">
                  {finishedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="library__book"
                      onClick={() => router.push(`/book/${book.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={book.imageLink}
                        alt={book.title}
                        className="library__book--img"
                      />
                      <div className="library__book--title">{book.title}</div>
                      <div className="library__book--author">{book.author}</div>
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