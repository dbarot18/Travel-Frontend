import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './components/Dashboard';
import TravelRequestForm from './components/TravelRequestForm';

function AppContent() {
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