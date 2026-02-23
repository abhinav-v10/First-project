import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PlasmaBackground from './components/PlasmaBackground';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FeedbackForm from './pages/FeedbackForm';
import DoctorsDirectory from './pages/DoctorsDirectory';
import DoctorProfile from './pages/DoctorProfile';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackSuccess from './pages/FeedbackSuccess';

function App() {
  return (
    <ThemeProvider>
      {/* Global plasma background — sits behind all pages */}
      <PlasmaBackground />
      <AuthProvider>
        <Router>
          <div className="relative z-10">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/doctors" element={<DoctorsDirectory />} />
              <Route path="/doctors/:doctorId" element={<DoctorProfile />} />

              {/* Requires login */}
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              } />
              <Route path="/feedback/success" element={
                <ProtectedRoute>
                  <FeedbackSuccess />
                </ProtectedRoute>
              } />

              {/* Doctor only */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
