import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBiKpi1FHR_GMj56nLzRqCWKYShwp18PfM",
  authDomain: "marketplace-auth-f8257.firebaseapp.com",
  projectId: "marketplace-auth-f8257",
  storageBucket: "marketplace-auth-f8257.firebasestorage.app",
  messagingSenderId: "154727865507",
  appId: "1:154727865507:web:f42895828b05d1f2a1f316"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
