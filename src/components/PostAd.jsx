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
    formData.append('upload_preset', 'marketplace_preset')

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
      onPost?.()
    } catch (err) {
      setStatus('❌ Error posting ad')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto my-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">📢 Post a New Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <div>
          <label className="block mb-1 text-sm font-medium">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imageUrl && <img src={imageUrl} alt="preview" className="mt-4 rounded-lg w-full max-w-xs" />}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          disabled={!title || !description || !imageUrl}
        >
          Post Ad
        </button>
        {status && <p className="text-sm text-gray-600 text-center">{status}</p>}
      </form>
    </div>
  )
}
