import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './components/Auth/Auth';
import Home from './components/Auth/Home';
import './App.css'

import Header from './components/Header/Header';

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);

  return (
    <>
      {isAuthenticated && <Header />}
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
    </>
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
