import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContextHandler.jsx";
import UserContextProvider from "./contexts/UserContextHandler.jsx";
import CommunityContextProvider from "./contexts/CommunityContextHandler.jsx";
import ProtectedAdminRoute from "./components/auth-components/ProtectedAdminRoute.jsx";
import ProtectedRoute from "./components/auth-components/ProtectedRoute.jsx";
import NotFound from "./pages/shared/NotFound.jsx";
import LandingPage from "./pages/guest/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import Contact from "./pages/shared/Contact.jsx";
import Resources from "./pages/shared/Resources.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Events from "./pages/user/Events/Events.jsx";
import MyEvents from "./pages/user/Events/MyEvents.jsx";
import PastEvents from "./pages/user/Events/PastEvents.jsx";
import Communities from "./pages/user/Community/Communities.jsx";
import MyCommunities from "./pages/user/Community/MyCommunities.jsx";
import Profile from "./pages/user/Profile/Profile.jsx";
import EventContextProvider from "./contexts/EventsContextHandler.jsx";
import ReactCalendar from "./pages/shared/Calendar.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest routes */}
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/resources" element={<Resources />} />

          {/* Member routes */}
          <Route
            exact
            path="/profile"
            element={
              <UserContextProvider>
                <ProtectedRoute component={Profile} />
              </UserContextProvider>
            }
          />
          <Route
            exact
            path="/user-dashboard"
            element={
              <UserContextProvider>
                <ProtectedRoute component={UserDashboard} />
              </UserContextProvider>
            }
          />
          <Route
            exact path="/events"
            element={
              <EventContextProvider>
            <ProtectedRoute component={Events} />
            </EventContextProvider>
          }
          />
          <Route
            exact path="/my-events"
            element={
              <EventContextProvider>
                <ProtectedRoute component={MyEvents} />
                </EventContextProvider>  }
          />
          <Route
            exact path="/past-events"
            element={
              <EventContextProvider>
                <ProtectedRoute component={PastEvents} />
                </EventContextProvider>  }
          />
          <Route
            exact path="/calendar"
            element={<ProtectedRoute component={ReactCalendar} />}
          />
          <Route
            exact
            path="/communities"
            element={
              <CommunityContextProvider>
                <ProtectedRoute component={Communities} />
              </CommunityContextProvider>
            }
          />
          <Route
            exact
            path="/my-communities"
            element={
              <CommunityContextProvider>
                <ProtectedRoute component={MyCommunities} />
              </CommunityContextProvider>
            }
          />

          {/* Admin routes */}
          <Route
            exact
            path="/admin-dashboard"
            element={
              <UserContextProvider>
                <ProtectedAdminRoute component={AdminDashboard} />
              </UserContextProvider>
            }
          />

          {/* 404 Not Found */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
