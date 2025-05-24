import { useEffect } from 'react'
import PostAd from '../components/PostAd'
import { auth } from '../lib/firebase'
import { useNavigate } from 'react-router-dom'

export default function PostAdPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/login')
    })
    return () => unsubscribe()
  }, [navigate])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Post a New Ad</h1>
      <PostAd />
    </div>
  )
}

