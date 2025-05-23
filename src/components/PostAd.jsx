import { useState } from 'react'
import { auth } from '../lib/firebase'

export default function PostAd({ onPost }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'marketplace_preset') // Cloudinary unsigned preset

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/domxt8bbd/image/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setImageUrl(data.secure_url)
    } catch (err) {
      setStatus('❌ Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user) return setStatus('❌ You must be logged in')

    const idToken = await user.getIdToken()

    try {
      const res = await fetch('https://marketplace-backend-p9dw.onrender.com/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          image_url: imageUrl,
        }),
      })

      if (!res.ok) throw new Error('Failed to post ad')
      setStatus('✅ Ad posted!')
      setTitle('')
      setDescription('')
      setImageUrl('')
      onPost?.() // optional callback to refresh ads
    } catch (err) {
      setStatus('❌ Error posting ad')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Post a New Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <input type="file" onChange={handleFileChange} className="w-full" accept="image/*" />
        {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 rounded w-48" />}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={!title || !description || !imageUrl}
        >
          Post Ad
        </button>
        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
      </form>
    </div>
  )
}

