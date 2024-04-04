import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './pages/auth/AuthHandler.jsx'
import ProtectedRoute from './pages/auth/ProtectedRoute.jsx'
import ProtectedAdminRoute from './pages/auth/ProtectedAdminRoute.jsx'
import LandingPage from './pages/guest/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import About from "./pages/shared/About.jsx"
import Contact from "./pages/shared/Contact.jsx"
import Resources from "./pages/shared/Resources.jsx"
import UserDashboard from './pages/user/UserDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Events from './pages/user/Events.jsx'
import EventRegistrations from './pages/user/EventRegistrations.jsx'
import UserContextHandler from './contexts/UserContextHandler.jsx';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Guest routes */}
                    <Route exact path="/" element={<LandingPage />} />
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route exact path="/about" element = {<About />} />
                    <Route exact path="/contact" element = {<Contact />} />
                    <Route exact path="/resources" element = {<Resources />} />

                    {/* Member routes */}
                    <Route exact path="/user-dashboard" 
                           element={<UserContextHandler><ProtectedRoute component = {UserDashboard} /></UserContextHandler>} />
                    <Route exact path="/events"
                           element={<ProtectedRoute component = {Events} />} />
                    <Route exact path="/event-registrations"
                           element={<ProtectedRoute component = {EventRegistrations} />} />

                    {/* Admin routes */}
                    <Route exact path="/admin-dashboard" 
                           element={<UserContextHandler><ProtectedAdminRoute component = {AdminDashboard} /></UserContextHandler>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App