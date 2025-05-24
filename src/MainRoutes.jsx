import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import PostAd from './components/PostAd'
import AdsGrid from './components/AdsGrid'
import AdDetails from './pages/AdDetails'

export default function MainRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdsGrid />} />
        <Route path="/post" element={<PostAd />} />
        <Route path="/ads/:id" element={<AdDetails />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  )
}
