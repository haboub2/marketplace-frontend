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
    <div className="p-4 bg-white rounded-xl shadow space-y-3">
      <h2 className="font-bold text-lg">Login</h2>
      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={login}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      <button
        onClick={register}
        className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Register
      </button>
      <hr />
      <button
        onClick={loginWithGoogle}
        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sign in with Google
      </button>
      {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
    </div>
  )
}
