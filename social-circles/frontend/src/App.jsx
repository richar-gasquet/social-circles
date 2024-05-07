import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContextHandler.jsx";
import UserContextProvider from "./contexts/UserContextHandler.jsx";
import CommunityContextProvider from "./contexts/CommunityContextHandler.jsx";
import ProtectedAdminRoute from "./components/auth-components/ProtectedAdminRoute.jsx";
import ProtectedRoute from "./components/auth-components/ProtectedRoute.jsx";
import NotFound from "./pages/shared/NotFound.jsx";
import Unauthorized from "./pages/shared/Unauthorized.jsx";
import LandingPage from "./pages/guest/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import Contact from "./pages/shared/Contact.jsx";
import Resources from "./pages/shared/Resources.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Events from "./pages/user/Events/Events.jsx";
import MyEvents from "./pages/user/Events/MyEvents.jsx";
import PastEvents from "./pages/user/Events/PastEvents.jsx";
import DanaEvents from "./pages/user/Events/DanaEvents.jsx";
import Communities from "./pages/user/Community/Communities.jsx";
import MyCommunities from "./pages/user/Community/MyCommunities.jsx";
import Profile from "./pages/user/Profile/Profile.jsx";
import EventContextProvider from "./contexts/EventsContextHandler.jsx";
import ReactCalendar from "./pages/shared/Calendar.jsx";
import EventPage from "./pages/user/Events/EventPage.jsx";
import CommunitiesPage from "./pages/user/Community/CommunitiesPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest routes */}
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route
            exact
            path="/resources"
            element={
              <UserContextProvider>
                <Resources />
              </UserContextProvider>
            }
          />

          {/* Profile route */}
          <Route
            exact
            path="/profile"
            element={
              <UserContextProvider>
                <ProtectedRoute component={Profile} />
              </UserContextProvider>
            }
          />

          {/* User dashboard route */}
          <Route
            exact
            path="/user-dashboard"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={UserDashboard} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />

          {/* Events routes */}
          <Route
            exact
            path="/events"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={Events} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />

          <Route
            path="/events/:eventId"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={EventPage} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />
          <Route
            exact
            path="/dana-events"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={DanaEvents} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />
          <Route
            exact
            path="/my-events"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={MyEvents} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />
          <Route
            exact
            path="/past-events"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={PastEvents} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />
          <Route
            exact
            path="/calendar"
            element={
              <UserContextProvider>
                <EventContextProvider>
                  <ProtectedRoute component={ReactCalendar} />
                </EventContextProvider>
              </UserContextProvider>
            }
          />

          {/* Communities routes */}
          <Route
            exact
            path="/communities"
            element={
              <UserContextProvider>
                <CommunityContextProvider>
                  <ProtectedRoute component={Communities} />
                </CommunityContextProvider>
              </UserContextProvider>
            }
          />
          <Route
            path="/communities/:groupId"
            element={
              <UserContextProvider>
                <CommunityContextProvider>
                  <ProtectedRoute component={CommunitiesPage} />
                </CommunityContextProvider>
              </UserContextProvider>
            }
          />
          <Route
            exact
            path="/my-communities"
            element={
              <UserContextProvider>
                <CommunityContextProvider>
                  <ProtectedRoute component={MyCommunities} />
                </CommunityContextProvider>
              </UserContextProvider>
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

          {/* 401 Unauthorized */}
          <Route
            exact
            path="/unauthorized"
            element={
              <UserContextProvider>
                <Unauthorized />
              </UserContextProvider>
            }
          />

          {/* 404 Not Found */}
          <Route
            path="/*"
            element={
              <UserContextProvider>
                <NotFound />
              </UserContextProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
