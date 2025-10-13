import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { fetchRequests } from './redux/requestsSlice';
import Dashboard from './components/Dashboard';
import TravelRequestForm from './components/TravelRequestForm';

const socket = io('http://localhost:5000');

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequests('all'));

    socket.on('newRequest', () => {
      dispatch(fetchRequests('all'));
    });

    socket.on('requestUpdated', () => {
      dispatch(fetchRequests('all'));
    });

    return () => {
      socket.off('newRequest');
      socket.off('requestUpdated');
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/request-form" element={<TravelRequestForm />} />
      <Route path="*" element={<TravelRequestForm />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;