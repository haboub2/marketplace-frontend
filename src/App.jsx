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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-gray-800">
      <header className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">My Marketplace</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {showLogin ? 'Close' : 'Login'}
            </button>
          )}
        </div>
      </header>

      {showLogin && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
          <div className="w-full max-w-md mx-4">
            <Login />
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {user ? (
          <PostAd />
        ) : (
          <p className="text-lg mb-6 text-center">
            👋 Welcome! Please <span className="font-semibold">log in</span> to post your own ad.
          </p>
        )}

        <AdsGrid />
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} My Marketplace. Built with Firebase & React.
      </footer>
    </div>
  )
}

export default App
