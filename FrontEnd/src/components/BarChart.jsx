import React, { useState, useEffect } from 'react';
import '../styles/BarChart.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChart = ({ selectedYear, selectedMonth }) => {
    const [barChartData, setBarChartData] = useState(null);
    const priceRanges = ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/barchart?month=${selectedYear}-${String(selectedMonth).padStart(2, '0')}`);
                
                // Map the fetched data to corresponding price ranges
                const dataCount = priceRanges.map(range => 
                    data.find(item => item._id === parseInt(range))?.itemCount || 0
                );

                setBarChartData({
                    labels: priceRanges,
                    datasets: [{
                        label: 'Items Count',
                        data: dataCount,
                        backgroundColor: '#3e7f91',
                        borderColor: '#3e7f91',
                        borderWidth: 1
                    }]
                });
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
            }
        };

        fetchData();
    }, [selectedYear, selectedMonth]);

    return (
        <div className="bar-chart">
            <h2 className="chart-title">
                Bar Chart Stats - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
            </h2>
            <div className="bar-chart-container">
                {barChartData ? (
                    <Bar data={barChartData} options={{ scales: { y: { beginAtZero: true } } }} />
                ) : (
                    <p>Loading chart data...</p>
                )}
            </div>
        </div>
    );
};

export default BarChart;
