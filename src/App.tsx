import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/events/EventsPage'
import MissAndMasterPage from './pages/miss-and-master/MissAndMasterPage'
import CandidateDetailPage from './pages/miss-and-master/CandidateDetailPage'
import PaymentReturn from './pages/miss-and-master/components/PaymentReturn'
import TombolaPage from './pages/tombola/TombolaPage'
import BoutiquePage from './pages/BoutiquePage'
import AboutPage from './pages/AboutPage'
import TeamPage from './pages/TeamPage'
import HistoryPage from './pages/HistoryPage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import ContactPage from './pages/ContactPage'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardSection from './pages/admin/sections/DashboardSection'
import RegistrationsSection from './pages/admin/sections/RegistrationsSection'
import TicketsSection from './pages/admin/sections/TicketsSection'
import QRValidationSection from './pages/admin/sections/QRValidationSection'
import MissAndMasterSection from './pages/admin/sections/MissAndMasterSection'
import PostsSection from './pages/admin/sections/PostsSection'
import SurveysSection from './pages/admin/sections/SurveysSection'
import UsersSection from './pages/admin/sections/UsersSection'
import FirebaseTest from './pages/FirebaseTest'
import WayEditionPage from './pages/way/WayEditionPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/miss-and-master" element={<MissAndMasterPage />} />
            <Route path="/miss-and-master/candidate/:id" element={<CandidateDetailPage />} />
            <Route path="/payment-return" element={<PaymentReturn />} />
            <Route path="/payment/verify" element={<PaymentReturn />} />
            <Route path="/payment/success" element={<PaymentReturn />} />
            <Route path="/payment/failed" element={<PaymentReturn />} />
            <Route path="/tombola" element={<TombolaPage />} />
            <Route path="/boutique" element={<BoutiquePage />} />
            <Route path="/firebase-test" element={<FirebaseTest />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/way-1" element={<WayEditionPage edition={1} />} />
            <Route path="/way-2" element={<WayEditionPage edition={2} />} />
            <Route path="/way-3" element={<WayEditionPage edition={3} />} />
            <Route path="/way-4" element={<WayEditionPage edition={4} />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardSection />} />
            <Route path="registrations" element={<RegistrationsSection />} />
            <Route path="tickets" element={<TicketsSection />} />
            <Route path="qr-validation" element={<QRValidationSection />} />
            <Route path="miss-master" element={<MissAndMasterSection />} />
            <Route path="posts" element={<PostsSection />} />
            <Route path="surveys" element={<SurveysSection />} />
            <Route path="users" element={<UsersSection />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
