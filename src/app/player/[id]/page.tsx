"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import SearchBar from "../../../components/Searchbar";

import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  audioLink?: string;
  bookDescription?: string;
  subscriptionRequired?: boolean;
};

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  
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
    if (!book || user === null) return;

    const isGuest = user?.isAnonymous;
    const canAccess = !book.subscriptionRequired || isGuest;

    if (!canAccess) {
      router.push("/choose-plan");
    }
  }, [book, user, router]);

  const handleEnded = async () => {
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
      await updateDoc(userRef, {
        finishedBooks: arrayUnion(bookData),
        savedBooks: arrayRemove(bookData),
      });
    } catch (err) {
      console.error("Finished error:", err);
    }
  };

  
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const rewind15 = () => { if (audioRef.current) audioRef.current.currentTime -= 15; };
  const forward15 = () => { if (audioRef.current) audioRef.current.currentTime += 15; };
  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  
  if (loading || !book) {
    return (
      <>
        <Sidebar />
        <SearchBar />
        <p style={{ padding: "24px" }}>Loading player...</p>
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
            <div className="player">

              
              <div className="summary">
                <div className="audio__book--summary">
                  <h1 className="audio__book--summary-title">{book.title}</h1>
                  <p className="audio__book--summary-author">{book.author}</p>
                  {book.bookDescription && (
                    <p className="audio__book--summary-text">{book.bookDescription}</p>
                  )}
                </div>
              </div>

              
              {book.audioLink && (
                <div className="audio__wrapper">

                  
                  <div className="audio__track--wrapper">
                    <figure className="audio__track--image-mask">
                      <img
                        src={book.imageLink}
                        alt={book.title}
                        className="book__image--wrapper"
                      />
                    </figure>

                    <div className="audio__track--details-wrapper">
                      <strong>{book.title}</strong>
                      <span className="audio__track--author">{book.author}</span>
                    </div>
                  </div>

                  
                  <div className="audio__controls--wrapper">
                    <div className="audio__controls">
                      <button className="audio__controls--btn" onClick={rewind15}>⏪</button>
                      <button className="audio__controls--btn" onClick={handlePlayPause}>
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                      <button className="audio__controls--btn" onClick={forward15}>⏩</button>
                    </div>

                    
                    <div className="audio__progress--wrapper">
                      <span className="audio__time">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="audio__progress"
                      />
                      <span className="audio__time">{formatTime(duration)}</span>
                    </div>
                  </div>

                  
                  <audio
                    ref={audioRef}
                    src={book.audioLink}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                  />

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}