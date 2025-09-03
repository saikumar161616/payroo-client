import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/LandingPage';
import EmployeesPage from './pages/EmployeesPage';
import TimesheetsPage from './pages/TimesheetsPage';
import PayrunPage from './pages/PayrunPage';

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/timesheets" element={<TimesheetsPage />} />
        <Route path="/payruns" element={<PayrunPage />} />
      </Routes>
    </Router>
  )

  // return (
  //   <div className="App">
  //     {/* <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header> */}
  //     <LandingPage />
  //   </div>
  // );
};

export default App;