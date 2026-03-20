"use client";
import React, { useState } from "react";
import Image from "next/image";
import pricingTop from "../../../public/pricing-top.png";
import Footer from "../../components/layout/Footer";


import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const faqData = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books, high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

const plans = [
  {
    id: "yearly",
    title: "Premium Plus Yearly",
    price: "$99.99/year",
    trial: true,
    priceId: "price_1TClMmCzG88H8eLx5fxSHUD3", 
  },
  {
    id: "monthly",
    title: "Premium Monthly",
    price: "$9.99/month",
    trial: false,
    priceId: "price_1TClNeCzG88H8eLx7JY9LvGA", // 
  },
];

const ChoosePlan: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [selectedPlan, setSelectedPlan] = useState<string>("yearly");
  const [loading, setLoading] = useState(false);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? -1 : index));
  };

 
  const handleCheckout = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to subscribe.");
      return;
    }

    setLoading(true);

    try {
      const selected = plans.find(p => p.id === selectedPlan);

      if (!selected) throw new Error("Invalid plan");

      const docRef = await addDoc(
        collection(db, "customers", user.uid, "checkout_sessions"),
        {
          price: selected.priceId,
          success_url: window.location.origin + "/success",
          cancel_url: window.location.origin + "/choose-plan",
        }
      );

      onSnapshot(docRef, (snap) => {
        const data = snap.data();

        if (!data) return;

        if (data.error) {
          console.error("Stripe error:", data.error);
          alert(`Error: ${data.error.message}`);
          setLoading(false);
        }

        if (data.url) {
          window.location.assign(data.url);
        }
      });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="plan">
      
      <div className="plan__header--wrapper">
        <div className="plan__header">
          <div className="plan__title">
            Get unlimited access to many amazing books to read
          </div>
          <div className="plan__sub--title">
            Turn ordinary moments into amazing learning opportunities
          </div>
          <figure className="plan__img--mask">
            <Image
              src={pricingTop}
              alt="pricing"
              width={860}
              height={722}
              style={{ objectFit: "cover" }}
            />
          </figure>
        </div>
      </div>

      
      <div className="plan__features--wrapper">
        <div className="plan__features">
          <div className="plan__features--text">
            <b>Key ideas in few min</b> with many books to read
          </div>
        </div>
        <div className="plan__features">
          <div className="plan__features--text">
            <b>3 million</b> people growing with Summarist everyday
          </div>
        </div>
        <div className="plan__features">
          <div className="plan__features--text">
            <b>Precise recommendations</b> collections curated by experts
          </div>
        </div>
      </div>

      
      <div className="section__title">Choose the plan that fits you</div>
      <div className="plan__cards--wrapper">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`plan__card ${selectedPlan === plan.id ? "plan__card--active" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="plan__card--circle">
              {selectedPlan === plan.id && (
                <div className="plan__card--dot plan__card--dot--active"></div>
              )}
            </div>
            <div className="plan__card--content">
              <div className="plan__card--title">{plan.title}</div>
              <div className="plan__card--price">{plan.price}</div>
              <div className="plan__card--text">
                {plan.trial ? "7-day free trial included" : "No trial included"}
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="plan__card--cta">
        <span className="btn--wrapper">
          <button
            className="btn"
            style={{ width: "300px", opacity: loading ? 0.7 : 1 }}
            onClick={handleCheckout}
            disabled={loading}
          >
            <span>
              {loading
                ? "Redirecting..."
                : selectedPlan === "yearly"
                ? "Start your free 7-day trial"
                : "Subscribe Monthly"}
            </span>
          </button>
        </span>
        {selectedPlan === "yearly" && (
          <div className="plan__disclaimer">
            Cancel your trial at any time before it ends, and you won’t be charged.
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="faq__wrapper" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {faqData.map((item, index) => (
          <div className="accordion__card" key={index}>
            <div className="accordion__header" onClick={() => toggleAccordion(index)}>
              <div className="accordion__title">{item.question}</div>
              <svg
                className={`accordion__icon ${openIndex === index ? "accordion__icon--rotate" : ""}`}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
            <div className={`collapse ${openIndex === index ? "show" : ""}`}>
              <div className="accordion__body">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>

      
      <Footer />
    </div>
  );
};

export default ChoosePlan;