import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { User } from '../types';

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getUserInfo();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  const handleLogout = (): void => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to Serverless Application Deployment Demo</h1>

      {!isAuthenticated ? (
        <div>
          <p>Please log in or register to access the application.</p>
          <nav style={{ marginTop: '20px' }}>
            <Link to="/login" style={{ marginRight: '15px' }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>
      ) : (
        <div>
          {error ? (
            <div style={{ color: 'red', marginBottom: '20px' }}>
              <p>Error: {error}</p>
            </div>
          ) : user ? (
            <div style={{ marginTop: '20px' }}>
              <h2>User Information</h2>
              <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Cognito ID:</strong> {user.cognitoId}</p>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
