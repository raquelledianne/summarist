"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  sendPasswordResetEmail
} from "firebase/auth"

import { auth, googleProvider } from "@/firebase/firebase"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: Props) {

  const router = useRouter()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }

      router.push("/for-you")
      onClose()

    } catch (err) {
      console.error(err)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.push("/for-you")
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth)
      router.push("/for-you")
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email first")
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      alert("Password reset email sent")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="auth__wrapper">
      <div className="auth">

        <div className="auth__content">

          <div className="auth__title">
            {isRegister ? "Create an Account" : "Log in to Summarist"}
          </div>

          

          <button
            className="btn guest__btn--wrapper"
            onClick={handleGuestLogin}
          >
            <div className="auth__icon--wrapper">
              <img src="/guest.jpg" alt="Guest Login" />
            </div>

            <span>Login as a Guest</span>
          </button>

          

          <button
            className="btn google__btn--wrapper"
            onClick={handleGoogleLogin}
          >
            <div className="auth__icon--wrapper">
              <img src="/google.png" alt="Google Login" />
            </div>

            <span>Login with Google</span>
          </button>

          

          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>

          

          <form
            className="auth__main--form"
            onSubmit={handleSubmit}
          >

            <input
              className="auth__main--input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="auth__main--input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn login__btn">
              <span>
                {isRegister ? "Register" : "Login"}
              </span>
            </button>

          </form>

        </div>

        

        <div
          className="auth__forgot--password"
          onClick={handleForgotPassword}
        >
          Forgot your password?
        </div>

       

        <button
          className="auth__switch--btn"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
        </button>

        

        <div
          className="auth__close--btn"
          onClick={onClose}
        >
          ✕
        </div>

      </div>
    </div>
  )
}