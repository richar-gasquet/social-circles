import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './pages/auth/AuthHandler.jsx'
import ProtectedRoute from './pages/auth/ProtectedRoute.jsx'
import LandingPage from './pages/guest/LandingPage.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route exact path="/" element={<LandingPage />} />
                    <Route exact path="/user-dashboard" 
                           element={<ProtectedRoute component = {UserDashboard} />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App