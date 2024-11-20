import React, { useState, useEffect } from 'react';
import '../styles/Transactions.css';
import axios from 'axios';

const Transactions = ({ selectedYear, selectedMonth, onMonthChange, onYearChange }) => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch transactions based on filters (year, month, page, search term)
    const fetchTransactions = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5001/api/transactions`, {
                params: {
                    month: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`,
                    page,
                    search: searchTerm
                }
            });
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Re-fetch transactions when filters change
    useEffect(() => {
        fetchTransactions();
    }, [selectedYear, selectedMonth, page, searchTerm]);

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2022, i).toLocaleString('default', { month: 'long' }),
        value: i + 1
    }));

    const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="transactions">
            {/* Filter section */}
            <div className="header">
                <input
                    type="text"
                    placeholder="Search transaction"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={selectedYear} onChange={(e) => onYearChange(parseInt(e.target.value))}>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select value={selectedMonth} onChange={(e) => onMonthChange(parseInt(e.target.value))}>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.name}</option>
                    ))}
                </select>
            </div>

            {/* Transactions table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.title}</td>
                            <td>{t.description}</td>
                            <td>{t.price}</td>
                            <td>{t.category}</td>
                            <td>{t.sold ? 'Yes' : 'No'}</td>
                            <td><img src={t.image} alt={t.title} style={{ width: '50px' }} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(page + 1)} disabled={transactions.length < itemsPerPage}>Next</button>
            </div>
        </div>
    );
};

export default Transactions;
