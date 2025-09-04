import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

// Lazy load the pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const EmployeesPage = lazy(() => import('./pages/EmployeesPage'));
const TimesheetsPage = lazy(() => import('./pages/TimesheetsPage'));
const PayrunPage = lazy(() => import('./pages/PayrunPage'));

const AppContent: React.FC = () => {

  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/timesheets" element={<TimesheetsPage />} />
          <Route path="/payruns" element={<PayrunPage />} />
        </Routes>
      </Suspense>
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