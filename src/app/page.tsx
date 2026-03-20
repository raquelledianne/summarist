"use client"

import { useState } from "react"

import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

import Landing from "../components/home/Landing"
import Features from "../components/home/Features"
import Reviews from "../components/home/Reviews"
import Numbers from "../components/home/Numbers"

import AuthModal from "../modals/AuthModal"

export default function Home() {

  const [authOpen, setAuthOpen] = useState(false)

  const openAuth = () => setAuthOpen(true)
  const closeAuth = () => setAuthOpen(false)

  return (
    <>
      <Navbar openAuth={openAuth} />

      <main>
        <Landing openAuth={openAuth} />
        <Features />
        <Reviews  />
        <Numbers />
      </main>

      <Footer />

      <AuthModal
        isOpen={authOpen}
        onClose={closeAuth}
      />
    </>
  )
} 