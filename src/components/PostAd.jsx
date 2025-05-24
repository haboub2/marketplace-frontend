import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'

export default function PostAd() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('car')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [extra, setExtra] = useState({
    model_year: '', doors: '', seats: '',
    brand: '', specs: '',
    area: '', rooms: '', price: '',
    job_title: '', salary: '', employment_type: ''
  })
  const [status, setStatus] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'marketplace-preset')
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
    if (!title || !description || !imageUrl || !location) return setStatus('❌ Please fill all fields')

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
          category,
          location,
          extra
        }),
      })
      if (!res.ok) throw new Error('Failed to post ad')
      navigate('/', { state: { success: '✅ Ad posted successfully!' } })
    } catch (err) {
      setStatus('❌ Error posting ad')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto my-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">📝 Post a New Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          className="w-full border p-2 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="car">Car</option>
          <option value="electronics">Electronics</option>
          <option value="real_estate">Real Estate</option>
          <option value="job">Job</option>
        </select>

        <input className="w-full border p-2 rounded-lg" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2 rounded-lg" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />

        <input className="w-full border p-2 rounded-lg" placeholder="Location (City or Region)" value={location} onChange={(e) => setLocation(e.target.value)} required />

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

        {category === 'car' && (
          <div className="space-y-2">
            <input className="w-full border p-2 rounded-lg" placeholder="Model Year" value={extra.model_year} onChange={(e) => setExtra({ ...extra, model_year: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Number of Doors" value={extra.doors} onChange={(e) => setExtra({ ...extra, doors: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Number of Seats" value={extra.seats} onChange={(e) => setExtra({ ...extra, seats: e.target.value })} />
          </div>
        )}

        {category === 'electronics' && (
          <div className="space-y-2">
            <input className="w-full border p-2 rounded-lg" placeholder="Brand" value={extra.brand} onChange={(e) => setExtra({ ...extra, brand: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Specs" value={extra.specs} onChange={(e) => setExtra({ ...extra, specs: e.target.value })} />
          </div>
        )}

        {category === 'real_estate' && (
          <div className="space-y-2">
            <input className="w-full border p-2 rounded-lg" placeholder="Area (m²)" value={extra.area} onChange={(e) => setExtra({ ...extra, area: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Rooms" value={extra.rooms} onChange={(e) => setExtra({ ...extra, rooms: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Price (SEK)" value={extra.price} onChange={(e) => setExtra({ ...extra, price: e.target.value })} />
          </div>
        )}

        {category === 'job' && (
          <div className="space-y-2">
            <input className="w-full border p-2 rounded-lg" placeholder="Job Title" value={extra.job_title} onChange={(e) => setExtra({ ...extra, job_title: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Salary (SEK)" value={extra.salary} onChange={(e) => setExtra({ ...extra, salary: e.target.value })} />
            <input className="w-full border p-2 rounded-lg" placeholder="Employment Type" value={extra.employment_type} onChange={(e) => setExtra({ ...extra, employment_type: e.target.value })} />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Post Ad
        </button>
        {status && <p className="text-sm text-center text-red-600 mt-2">{status}</p>}
      </form>
    </div>
  )
}
