import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import CameraFeed from './components/CameraFeed';
import EmergencyPanel from './components/EmergencyPanel';
import HistoryPanel from './components/HistoryPanel';
import { Home, Phone, History, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-white text-2xl p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;

  return (
    <nav className="bg-gray-900 p-4 border-t border-yellow-400 fixed bottom-0 w-full flex justify-around z-50">
      <Link to="/" className="flex flex-col items-center text-yellow-400 hover:text-white">
        <Home size={32} />
        <span className="text-sm font-bold">HOME</span>
      </Link>
      <Link to="/contacts" className="flex flex-col items-center text-yellow-400 hover:text-white">
        <Phone size={32} />
        <span className="text-sm font-bold">CONTACTS</span>
      </Link>
      <Link to="/history" className="flex flex-col items-center text-yellow-400 hover:text-white">
        <History size={32} />
        <span className="text-sm font-bold">HISTORY</span>
      </Link>
      <button onClick={logout} className="flex flex-col items-center text-red-500 hover:text-red-300">
        <LogOut size={32} />
        <span className="text-sm font-bold">LOGOUT</span>
      </button>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-black min-h-screen pb-20"> {/* Padding bottom for nav */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <ProtectedRoute>
                <CameraFeed />
              </ProtectedRoute>
            } />

            <Route path="/contacts" element={
              <ProtectedRoute>
                <div className="p-4">
                  <EmergencyPanel />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute>
                <div className="p-4 h-screen">
                  <HistoryPanel />
                </div>
              </ProtectedRoute>
            } />
          </Routes>
          <Navigation />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
