import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import Home from './components/Auth/Home';
import './App.css'

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route
        path="/auth"
        element={!isAuthenticated ? <Auth /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
