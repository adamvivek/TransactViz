import React, { useState, useEffect } from 'react';
import '../styles/Statistics.css';
import axios from 'axios';

const Statistics = ({ selectedYear, selectedMonth }) => {
    const [statistics, setStatistics] = useState({});

    // Fetch statistics when year or month changes
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Requesting data from the server with formatted date
                const res = await axios.get(`http://localhost:5001/api/statistics?month=${selectedYear}-${String(selectedMonth).padStart(2, '0')}`);
                setStatistics(res.data); // Update state with response data
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, [selectedYear, selectedMonth]); // Re-run effect when year or month changes

    // Format month name from number
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });

    return (
        <div className="statistics">
            <h2 className="stat-title">Statistics - {monthName} {selectedYear}</h2>
            <div className="stat-box">
                {/* Display statistics or default to 0 if data is unavailable */}
                <div className="stat-item">Total Sale: {statistics.totalSale || 0}</div>
                <div className="stat-item">Total Sold Items: {statistics.totalSold || 0}</div>
                <div className="stat-item">Total Not Sold Items: {statistics.totalNotSold || 0}</div>
            </div>
        </div>
    );
};

export default Statistics;
