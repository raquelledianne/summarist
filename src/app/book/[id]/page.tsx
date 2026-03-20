"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import SearchBar from "../../../components/Searchbar";


import { AiOutlineBook } from "react-icons/ai";
import { BsHeadphones } from "react-icons/bs";


import { auth, db } from "@/firebase/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

 
  useEffect(() => {
    const checkIfSaved = async () => {
      const user = auth.currentUser;
      if (!user || !book) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          const isSaved = data.savedBooks?.some(
            (b: any) => b.id === book.id
          );
          setSaved(!!isSaved);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkIfSaved();
  }, [book]);


  const toggleBookmark = async () => {
    const user = auth.currentUser;
    if (!user || !book) return;

    const userRef = doc(db, "users", user.uid);

    const bookData = {
      id: book.id,
      title: book.title,
      author: book.author,
      imageLink: book.imageLink,
    };

    try {
      
      await setDoc(userRef, {}, { merge: true });

      if (saved) {
        await updateDoc(userRef, {
          savedBooks: arrayRemove(bookData),
        });
      } else {
        await updateDoc(userRef, {
          savedBooks: arrayUnion(bookData),
        });
      }

      setSaved(!saved);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

 
  return (
    <>
      <Sidebar />
      <SearchBar />

      <div className="wrapper">
        <div className="row">
          <div className="container">

            {loading ? (
              <div className="inner__book--skeleton">
                <div className="inner__book--skeleton-content">
                  <div className="skeleton" style={{ width: "70%", height: 32, marginBottom: 16 }} />
                  <div className="skeleton" style={{ width: "40%", height: 32, marginBottom: 16 }} />
                  <div className="skeleton" style={{ width: "100%", height: 32, marginBottom: 16 }} />
                </div>
                <div className="inner__book--skeleton-img">
                  <div className="skeleton" style={{ width: 300, height: 300 }} />
                </div>
              </div>
            ) : (
              <div className="inner__wrapper">

                
                <div className="inner__book">

                  <h1 className="inner-book__title">{book.title}</h1>

                  {book.subTitle && (
                    <h3 className="inner-book__sub--title">
                      {book.subTitle}
                    </h3>
                  )}

                  <div className="inner-book__author">
                    {book.author}
                  </div>

                  
                  <div className="inner-book__read--btn-wrapper">

                    <div
                      className="inner-book__read--btn"
                      onClick={() => router.push(`/player/${id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <AiOutlineBook size={24} />
                      Read
                    </div>

                    <div
                      className="inner-book__read--btn"
                      onClick={() => router.push(`/player/${id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <BsHeadphones size={24} />
                      Listen
                    </div>

                  </div>

                  
                  <div className="inner-book__wrapper">
                    <div className="inner-book__description--wrapper">

                      <div>⭐ {book.averageRating?.toFixed(1) || "N/A"}</div>
                      <div>👥 {book.totalRating || "N/A"} ratings</div>
                      <div>📘 {book.type || "N/A"}</div>
                      <div>📊 {book.status || "N/A"}</div>

                    </div>
                  </div>

                  
                  <div
                    className="inner-book__bookmark"
                    onClick={toggleBookmark}
                    style={{ cursor: "pointer" }}
                  >
                    {saved ? "Saved to Library" : "Add to Library"}
                  </div>

                 
                  {book.bookDescription && (
                    <>
                      <h2 className="inner-book__secondary--title">
                        What's it about?
                      </h2>
                      <p className="inner-book__book--description">
                        {book.bookDescription}
                      </p>
                    </>
                  )}

                 
                  {book.tags?.length > 0 && (
                    <>
                      <h2 className="inner-book__secondary--title">Tags</h2>
                      <div className="inner-book__tags--wrapper">
                        {book.tags.map((tag: string, i: number) => (
                          <div key={i} className="inner-book__tag">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  
                  {book.authorDescription && (
                    <>
                      <h2 className="inner-book__author--title">
                        About the Author
                      </h2>
                      <p className="inner-book__author--description">
                        {book.authorDescription}
                      </p>
                    </>
                  )}

                </div>

                
                <div className="inner-book--img-wrapper">
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    className="inner-book__img"
                  />
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}