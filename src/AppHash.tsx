import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import EventsPage from './pages/events/EventsPage'
import MissAndMasterPage from './pages/miss-and-master/MissAndMasterPage'
import TombolaPage from './pages/tombola/TombolaPage'
import BoutiquePage from './pages/BoutiquePage'
import AboutPage from './pages/AboutPage'
import TeamPage from './pages/TeamPage'
import HistoryPage from './pages/HistoryPage'
import PostsPage from './pages/PostsPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/admin/AdminPage'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    console.log('Login clicked')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    console.log('Logout clicked')
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar
          isAuthenticated={isAuthenticated}
          userAvatar="https://via.placeholder.com/32"
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/miss-and-master" element={<MissAndMasterPage />} />
          <Route path="/tombola" element={<TombolaPage />} />
          <Route path="/boutique" element={<BoutiquePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App 