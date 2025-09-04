import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light mb-2">
    <div className="container-fluid px-3">
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link" to="/employees">Employees</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/timesheets">Timesheets</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/payruns">Payruns</NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;