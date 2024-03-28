import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './pages/auth/AuthHandler.jsx'
import ProtectedRoute from './pages/auth/ProtectedRoute.jsx'
import LandingPage from './pages/guest/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
import Events from './pages/user/Events.jsx'
import EventRegistrations from './pages/user/EventRegistrations.jsx'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route exact path="/" element={<LandingPage />} />
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route exact path="/user-dashboard" 
                           element={<ProtectedRoute component = {UserDashboard} />} />
                    <Route exact path="/events"
                           element={<ProtectedRoute component = {Events} />} />
                    <Route exact path="/event-registrations"
                           element={<ProtectedRoute component = {EventRegistrations} />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App