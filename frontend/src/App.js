import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Holds the logged-in user's info

  const handleLogin = (userData) => {
    setUser(userData); // Set user info (includes isAdmin)
  };

  const handleLogout = () => {
    setUser(null); // Clear user info on logout
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={!!user} isAdmin={user?.isAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage onLogin={handleLogin} />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/user"
            element={user ? <UserPage user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={
              user && user.isAdmin ? <AdminPage user={user} /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

