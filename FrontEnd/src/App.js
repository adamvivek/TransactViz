import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BarChart from './components/BarChart';
import Statistics from './components/Statistics';
import Transactions from './components/Transactions';
import Sidebar from './components/SideBar';
import './App.css';

const App = () => {
    // State to manage selected year and month
    const [selectedYear, setSelectedYear] = useState(2022);
    const [selectedMonth, setSelectedMonth] = useState(3);

    // Common props for the routes to avoid repetition
    const commonProps = { 
        selectedYear, 
        selectedMonth, 
        onYearChange: setSelectedYear, 
        onMonthChange: setSelectedMonth 
    };

    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <h1>MERN Stack Coding Challenge [ Vivek Adam ]</h1>
                </header>
                <div className="app-body">
                    <Sidebar />
                    <div className="main-content">
                        <Routes>
                            {/* Define routes and pass common props to components */}
                            <Route path="/transactions" element={<Transactions {...commonProps} />} />
                            <Route path="/statistics" element={<Statistics selectedYear={selectedYear} selectedMonth={selectedMonth} />} />
                            <Route path="/bar-chart" element={<BarChart selectedYear={selectedYear} selectedMonth={selectedMonth} />} />
                            <Route path="/" element={<Transactions {...commonProps} />} /> {/* Default route */}
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
