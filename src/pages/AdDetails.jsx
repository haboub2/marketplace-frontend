import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function AdDetails() {
  const { id } = useParams()
  const [ad, setAd] = useState(null)
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`https://marketplace-backend-p9dw.onrender.com/ads/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load ad')
        return res.json()
      })
      .then(data => {
        setAd(data.ad)
        setImages([data.ad.image_url, ...(data.images || [])])
      })
      .catch(err => setError(err.message))
  }, [id])

  if (error) return <div className="p-6 text-red-500">❌ {error}</div>
  if (!ad) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Carousel showThumbs={true} infiniteLoop className="rounded-xl">
        {images.map((url, idx) => (
          <div key={idx}>
            <img src={url} alt={`Ad image ${idx + 1}`} className="rounded-xl object-cover" />
          </div>
        ))}
      </Carousel>

      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
        <p className="text-gray-700 mb-4">{ad.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ad.category === 'car' && (
            <>
              <p><strong>Model Year:</strong> {ad.model_year}</p>
              <p><strong>Doors:</strong> {ad.doors}</p>
              <p><strong>Seats:</strong> {ad.seats}</p>
            </>
          )}
          {ad.category === 'electronics' && (
            <>
              <p><strong>Brand:</strong> {ad.brand}</p>
              <p><strong>Specs:</strong> {ad.specs}</p>
            </>
          )}
          {ad.category === 'real_estate' && (
            <>
              <p><strong>Area:</strong> {ad.area} m²</p>
              <p><strong>Rooms:</strong> {ad.rooms}</p>
              <p><strong>Price:</strong> {ad.real_estate_price} SEK</p>
            </>
          )}
          {ad.category === 'job' && (
            <>
              <p><strong>Title:</strong> {ad.job_title}</p>
              <p><strong>Salary:</strong> {ad.salary} SEK</p>
              <p><strong>Type:</strong> {ad.employment_type}</p>
            </>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Posted by:</strong> {ad.user_id}</p>
          <p><strong>Date:</strong> {new Date(ad.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

