import React, { useEffect, useState } from 'react'
import { auth } from './lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Login from './components/Login'
import PostAd from './components/PostAd'
import AdsGrid from './components/AdsGrid'

function App() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut(auth)
    setShowLogin(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-gray-800">Marketplace</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showLogin ? 'Close' : 'Login'}
            </button>
          )}
        </div>
      </header>

      {showLogin && !user && (
        <div className="absolute right-4 top-20 w-full max-w-sm mx-auto z-10">
          <Login />
        </div>
      )}

      <main className="p-6 text-gray-800">
        {user ? (
          <PostAd />
        ) : (
          <p className="text-lg mb-6">Welcome to the marketplace! Please log in to post an ad.</p>
        )}

        <AdsGrid />
      </main>
    </div>
  )
}

export default App
