import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { auth } from './lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Login from './components/Login'
import PostAd from './components/PostAd'
import AdsGrid from './components/AdsGrid'
import AdDetails from './pages/AdDetails'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut(auth)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <Link to="/" className="text-2xl font-bold tracking-tight text-blue-700">
              🌟 My Marketplace
            </Link>

            <div className="flex gap-4 items-center">
              <Link
                to="/post"
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow text-sm ${!user ? 'hidden' : ''}`}
              >
                + Post Ad
              </Link>

              {user ? (
                <>
                  <span className="hidden sm:inline-block text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<AdsGrid />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/post" element={user ? <PostAd /> : <Navigate to="/login" />} />
            <Route path="/ads/:id" element={<AdDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
