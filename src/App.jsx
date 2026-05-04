import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import HistoryPage from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './authConfig';
import BottomNav from './components/BottomNav';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const CursorSpotlight = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        const root = document.getElementById('root');
        if (root) {
          const rect = root.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          spotlightRef.current.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div ref={spotlightRef} className="cursor-spotlight" />;
};

const NavigationManager = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showNav = ['/chat', '/explore', '/profile', '/history', '/settings'].includes(location.pathname);
  return user && showNav ? <BottomNav /> : null;
};

const AppContent = () => {
  const { language } = useLanguage();
  return (
    <div key={language} style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <BrowserRouter>
        <CursorSpotlight />
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <NavigationManager />
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
