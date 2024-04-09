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
import RegisteredEvents from './pages/user/RegisteredEvents.jsx'
import Calendar from './pages/user/Calendar.jsx'
import Communities from './pages/user/Communities.jsx'
import MyCommunities from './pages/user/MyCommunities.jsx'
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
                     <Route exact path="/registered-events"
                           element={<ProtectedRoute component = {RegisteredEvents} />} />
                     <Route exact path="/calendar"
                           element={<ProtectedRoute component = {Calendar} />} />
                     <Route exact path="/communities"
                           element={<ProtectedRoute component = {Communities}/>} />
                     <Route exact path="/my-communities"
                           element={<ProtectedRoute component = {MyCommunities}/>} />

                    {/* Admin routes */}
                    <Route exact path="/admin-dashboard" 
                           element={<UserContextHandler><ProtectedAdminRoute component = {AdminDashboard} /></UserContextHandler>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App