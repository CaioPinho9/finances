import { useAuth } from '../hooks/use-auth.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import CSVUploader from './CSVUploader.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={() => { logout(); navigate('/'); }} style={{ backgroundColor: 'red' }}>
        Logout
      </button>
      <hr />
      <CSVUploader />
    </div>
  );
}
