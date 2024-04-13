import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContextHandler.jsx";
import UserContextProvider from "./contexts/UserContextHandler.jsx";
import CommunityContextProvider from "./contexts/CommunityContextHandler.jsx";
import ProtectedAdminRoute from "./components/auth-components/ProtectedAdminRoute.jsx";
import ProtectedRoute from "./components/auth-components/ProtectedRoute.jsx";
import LandingPage from "./pages/guest/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import About from "./pages/shared/About.jsx";
import Contact from "./pages/shared/Contact.jsx";
import Resources from "./pages/shared/Resources.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Events from "./pages/user/Events/Events.jsx";
import RegisteredEvents from "./pages/user/Events/RegisteredEvents.jsx";
import Calendar from "./pages/user/Calendar.jsx";
import Communities from "./pages/user/Community/Communities.jsx";
import MyCommunities from "./pages/user/Community/MyCommunities.jsx";
import Profile from "./pages/user/Profile/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest routes */}
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/resources" element={<Resources />} />

          {/* Member routes */}
          <Route
            exact path="/profile" 
            element={
                <UserContextProvider>
                    <ProtectedRoute component = {Profile} />
                </UserContextProvider>
            } 
          />
          <Route
            exact path="/user-dashboard"
            element={
              <UserContextProvider>
                <ProtectedRoute component={UserDashboard} />
              </UserContextProvider>
            }
          />
          <Route
            exact path="/events"
            element={<ProtectedRoute component={Events} />}
          />
          <Route
            exact path="/registered-events"
            element={<ProtectedRoute component={RegisteredEvents} />}
          />
          <Route
            exact path="/calendar"
            element={<ProtectedRoute component={Calendar} />}
          />
          <Route
            exact path="/communities"
            element={
              <CommunityContextProvider>
                  <ProtectedRoute component={Communities} />
              </CommunityContextProvider>
            }
          />
          <Route
            exact path="/my-communities"
            element={
              <CommunityContextProvider>
                  <ProtectedRoute component={MyCommunities} />
              </CommunityContextProvider>
            }
          />

          {/* Admin routes */}
          <Route
            exact path="/admin-dashboard"
            element={
              <UserContextProvider>
                <ProtectedAdminRoute component={AdminDashboard} />
              </UserContextProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
