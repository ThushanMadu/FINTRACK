import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import LoadingScreen from '../ui/LoadingScreen';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;