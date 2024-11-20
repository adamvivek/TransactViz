import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SideBar.css'; 
const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/transactions">Transctions Table</Link>
        </li>
        <li>
          <Link to="/statistics">Transctions Statistics</Link>
        </li>
        <li>
          <Link to="/bar-chart">Transactions BarChart</Link>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;