import { useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setStatus('✅ Logged in')
    } catch {
      setStatus('❌ Failed. Try again or Register.')
    }
  }

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setStatus('✅ Account created')
    } catch {
      setStatus('❌ Registration failed')
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      setStatus('✅ Google login successful')
    } catch {
      setStatus('❌ Google login failed')
    }
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Login or Register</h2>
      <input
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={login}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={register}
          className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
        >
          Register
        </button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>
      <button
        onClick={loginWithGoogle}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
      >
        Sign in with Google
      </button>
      {status && <p className="text-sm text-gray-600 text-center">{status}</p>}
    </div>
  )
}