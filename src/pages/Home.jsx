import AdsGrid from '../components/AdsGrid'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛍️ Latest Ads</h1>
      <AdsGrid />
    </div>
  )
}

