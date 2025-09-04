import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import EmployeesPage from './pages/EmployeesPage';
import TimesheetsPage from './pages/TimesheetsPage';
import PayrunPage from './pages/PayrunPage';
import Navbar from './components/Navbar';

const AppContent: React.FC = () => {

  const location = useLocation();
  console.log("Current location:", location.pathname);
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/timesheets" element={<TimesheetsPage />} />
        <Route path="/payruns" element={<PayrunPage />} />
      </Routes>
    </>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;