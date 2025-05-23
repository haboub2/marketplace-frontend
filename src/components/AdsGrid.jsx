import { useEffect, useState } from 'react'

export default function AdsGrid() {
  const [ads, setAds] = useState([])

  useEffect(() => {
    fetch('https://marketplace-backend-p9dw.onrender.com/ads')
      .then(res => res.json())
      .then(data => setAds(data))
      .catch(err => console.error('Failed to fetch ads:', err))
  }, [])

  return (
    <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3">
      {ads.map(ad => (
        <div
          key={ad.id}
          className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-1 text-gray-800">{ad.title}</h3>
          <p className="text-sm mb-3 text-gray-600">{ad.description}</p>
          {ad.image_url && (
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-48 object-cover rounded-lg border"
            />
          )}
        </div>
      ))}
    </div>
  )
}