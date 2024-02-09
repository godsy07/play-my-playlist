import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import HomePage from "./pages/HomePage/HomePage";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp";
import CreateRoom from "./pages/CreateRoom/CreateRoom";
import JoinRoom from "./pages/JoinRoom/JoinRoom";
import NotFoundPage from "./pages/NotFoundPage";
// import ProtectedRoute from "./functionalities/ProtectedRoutes";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UserSettings from "./pages/UserSettings/UserSettings";
import Dashboard from "./pages/Dashboard/Dashboard";
import MainContainer from "./components/layouts/MainContainer";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import QueryProvider from "./components/providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <CookiesProvider>
        <Router>
          <Routes>
            <Route
              path="/user/:user_id/verify/:token"
              element={<VerifyEmail />}
            />
            <Route path="/" element={<MainContainer />}>
              <Route path="/" element={<Navigate replace to="home" />} />
              <Route path="home" element={<HomePage />} />
              <Route path="login-signup" element={<LoginSignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="createRoom" element={<CreateRoom />} />
              <Route path="userSettings" element={<UserSettings />} />
              <Route path="joinRoom" element={<JoinRoom />} />
              <Route path="dashboard/:id/:room_id" element={<Dashboard />} />
            </Route>

            {/* 
          <Route exact path='*' component={NotFoundPage} />
          */}
          </Routes>
        </Router>
      </CookiesProvider>
    </QueryProvider>
  );
}

export default App;
