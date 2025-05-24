import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdsGrid() {
  const [ads, setAds] = useState([])
  const [filtered, setFiltered] = useState([])
  const [page, setPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('newest')
  const [location, setLocation] = useState('')
  const adsPerPage = 25

  useEffect(() => {
    fetch('https://marketplace-backend-p9dw.onrender.com/ads')
      .then(res => res.json())
      .then(data => {
        setAds(data)
        setFiltered(data)
      })
      .catch(err => console.error('Failed to load ads', err))
  }, [])

  useEffect(() => {
    let result = [...ads]

    if (selectedCategories.length > 0) {
      result = result.filter(ad => selectedCategories.includes(ad.category))
    }

    if (search.trim()) {
      const keyword = search.toLowerCase()
      result = result.filter(ad =>
        ad.title.toLowerCase().includes(keyword) ||
        ad.description.toLowerCase().includes(keyword)
      )
    }

    if (location.trim()) {
      result = result.filter(ad => ad.location?.toLowerCase().includes(location.toLowerCase()))
    }

    if (minPrice) {
      result = result.filter(ad => Number(ad.price || ad.real_estate_price || ad.salary) >= Number(minPrice))
    }

    if (maxPrice) {
      result = result.filter(ad => Number(ad.price || ad.real_estate_price || ad.salary) <= Number(maxPrice))
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => (a.price || a.real_estate_price || a.salary || 0) - (b.price || b.real_estate_price || b.salary || 0))
    } else if (sort === 'price_desc') {
      result.sort((a, b) => (b.price || b.real_estate_price || b.salary || 0) - (a.price || a.real_estate_price || a.salary || 0))
    } else {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    setFiltered(result)
    setPage(1)
  }, [ads, selectedCategories, search, location, minPrice, maxPrice, sort])

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const startIndex = (page - 1) * adsPerPage
  const currentAds = filtered.slice(startIndex, startIndex + adsPerPage)
  const totalPages = Math.ceil(filtered.length / adsPerPage)

  return (
    <div className="bg-gray-50">
      <div className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 p-10 text-center shadow mb-6">
        <h1 className="text-3xl font-bold">Find What You Need</h1>
        <p className="text-sm">Search or filter through thousands of ads from across Sweden</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Sidebar Filters */}
        <aside className="md:col-span-1 bg-white rounded-xl shadow p-4 border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Smart Filters</h2>

          <input
            type="text"
            placeholder="🔍 Keyword..."
            className="w-full border border-blue-300 p-2 rounded-lg mb-4"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="📍 Location"
            className="w-full border border-blue-300 p-2 rounded-lg mb-4"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />

          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border border-blue-300 p-2 rounded"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border border-blue-300 p-2 rounded"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium text-blue-700">Sort by</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full border border-blue-300 p-2 rounded"
            >
              <option value="newest">🕓 Newest</option>
              <option value="price_asc">⬆️ Price Low → High</option>
              <option value="price_desc">⬇️ Price High → Low</option>
            </select>
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium text-blue-700 mb-1">Categories</p>
            {['car', 'electronics', 'real_estate', 'job'].map(cat => (
              <button
                key={cat}
                className={`block w-full text-left px-3 py-2 rounded mb-1 ${selectedCategories.includes(cat) ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat === 'car' && '🚗 Cars'}
                {cat === 'electronics' && '💻 Electronics'}
                {cat === 'real_estate' && '🏠 Real Estate'}
                {cat === 'job' && '👔 Jobs'}
              </button>
            ))}
          </div>
        </aside>

        {/* Ads Grid */}
        <div className="md:col-span-3">
          <div className="flex justify-end mb-4">
            <Link
              to="/post"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              ➕ Post New Ad
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAds.map(ad => (
              <Link
                to={`/ads/${ad.id}`}
                key={ad.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden border border-gray-200"
              >
                <div className="h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{ad.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{ad.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400 capitalize">{ad.category}</span>
                    <span className="text-sm font-semibold text-green-700">
                      {ad.real_estate_price ? `${ad.real_estate_price} SEK` : ad.salary ? `${ad.salary} SEK` : ad.price ? `${ad.price} SEK` : ''}
                    </span>
                  </div>
                  {ad.location && (
                    <div className="text-xs text-gray-500 mt-1">📍 {ad.location}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                disabled={page === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
