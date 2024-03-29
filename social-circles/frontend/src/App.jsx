import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './pages/auth/AuthHandler.jsx'
import ProtectedRoute from './pages/auth/ProtectedRoute.jsx'
import LandingPage from './pages/guest/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import About from "./pages/shared/About.jsx"
import Contact from "./pages/shared/Contact.jsx"
import Resources from "./pages/shared/Resources.jsx"
import UserDashboard from './pages/user/UserDashboard.jsx'
import Events from './pages/user/Events.jsx'
import EventRegistrations from './pages/user/EventRegistrations.jsx'
import UserContextProvider from './contexts/UserContextProvider';

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
                           element={<UserContextProvider><ProtectedRoute component = {UserDashboard} /></UserContextProvider>} />
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