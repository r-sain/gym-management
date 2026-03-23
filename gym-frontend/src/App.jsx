import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddMember from './pages/AddMember';
import Login from './pages/Login';
import { pingServer } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('gym_auth') === 'true'
  );

  // Wake up server on mount
  useEffect(() => {
    pingServer();
  }, []);

  const handleLogin = () => {
    localStorage.setItem('gym_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('gym_auth');
    setIsAuthenticated(false);
  };

  // 10-minute inactivity lock
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, 10 * 60 * 1000); // 10 minutes
    };

    // Events to track user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer(); // Initialize timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-dark w-full font-sans text-slate-100 selection:bg-primary/30 selection:text-white">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/add"
            element={isAuthenticated ? <AddMember onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
