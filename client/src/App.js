import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp";
import CreateRoom from "./pages/CreateRoom/CreateRoom";
import JoinRoom from "./pages/JoinRoom/JoinRoom";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./functionalities/ProtectedRoutes";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UserSettings from "./pages/UserSettings/UserSettings";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/login-signup' component={LoginSignUp} />
        <Route exact path='/forgot-password' component={ForgotPassword} />
        <ProtectedRoute exact path='/createRoom' component={CreateRoom} />
        <ProtectedRoute exact path='/userSettings' component={UserSettings} />
        <ProtectedRoute exact path='/joinRoom' component={JoinRoom} />
        {/* <ProtectedRoute exact path='/dashboard' component={PlayerDashboard} /> */}
        <ProtectedRoute exact path='/dashboard' component={Dashboard} />
        {/* <ProtectedRoute exact path='/game-room' component={GameRoom} /> */}
        <Route exact path='*' component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

export default App;
