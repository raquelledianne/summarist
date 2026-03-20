"use client";

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/Searchbar"

const db = getFirestore();
const auth = getAuth();

const Settings: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("Basic");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    setEmail(user.email);

    const unsubscribe = onSnapshot(
      collection(db, "customers", user.uid, "subscriptions"),
      (snapshot) => {
        if (snapshot.empty) {
          setPlan("Basic");
          setLoading(false);
          return;
        }

        const sub = snapshot.docs[0].data();

        if (sub.status === "active") {
          if (sub.price?.id === "price_1TClMmCzG88H8eLx5fxSHUD3") {
            setPlan("Premium Yearly");
          } else {
            setPlan("Premium Monthly");
          }
        } else {
          setPlan("Basic");
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  
  if (loading) {
    return (
      <div className="settings">
        <div className="settings__header">
          <div className="settings__title skeleton skeleton--title"></div>
          <div className="settings__search skeleton skeleton--search"></div>
        </div>

        <div className="settings__card">
          <div className="settings__section">
            <div className="skeleton skeleton--label"></div>
            <div className="skeleton skeleton--value"></div>
          </div>

          <div className="settings__divider" />

          <div className="settings__section">
            <div className="skeleton skeleton--label"></div>
            <div className="skeleton skeleton--value"></div>
          </div>

          <div className="settings__divider" />

          <div className="settings__section">
            <div className="skeleton skeleton--button"></div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="settings">
      
      <div className="settings__header">
        <h1 className="settings__title">Settings</h1>

        <div className="settings__search">
          <SearchBar />
        </div>
      </div>

      
      <div className="settings__card">
        
        <div className="settings__section">
          <h3 className="settings__label">Email</h3>
          <p className="settings__value">
            {email || "Not logged in"}
          </p>
        </div>

        <div className="settings__divider" />

        
        <div className="settings__section">
          <h3 className="settings__label">Subscription Plan</h3>
          <p
            className={`settings__value ${
              plan === "Basic"
                ? "settings__value--basic"
                : "settings__value--premium"
            }`}
          >
            {plan}
          </p>
        </div>

        <div className="settings__divider" />

        
        <div className="settings__section">
          {plan === "Basic" ? (
            <button
              className="settings__btn"
              onClick={() => router.push("/choose-plan")}
            >
              Upgrade to Premium
            </button>
          ) : (
            <div className="settings__badge">
              🎉 You are a Premium member
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;