const transactionModel = require('../models/transactionModel');

const listTransactions = async (req, res) => {
    try {
        const { month, search = '', page = 1, limit = 60 } = req.query;

        let startDate = null;
        let endDate = null;

        if (month) {
            // Convert month to Date range (start and end of the month)
            startDate = new Date(`${month}-01T00:00:00Z`);
            endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(0); // last day of the month
            endDate.setHours(23, 59, 59, 999);
        }

        // Build filter query
        const filter = {
            ...(startDate && endDate && { 
                dateOfSale: { 
                    $gte: startDate, 
                    $lt: endDate 
                }
            }),
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };

        // Fetch transactions
        const results = await transactionModel.getTransactions(filter, page, parseInt(limit));
        res.json(results);
    } catch (err) {
        console.error("Error in listing transactions:", err);
        res.status(500).json({ error: err.message });
    }
};

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        const results = await transactionModel.getStatistics(month);
        res.json(results || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBarChart = async (req, res) => {
    try {
        const { month } = req.query;
        const results = await transactionModel.getPriceRangeData(month);
        res.json(results || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategoryData = async (req, res) => {
    try {
        const { month } = req.query;
        const results = await transactionModel.getCategoryData(month);
        res.json(results || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;
        const results = await transactionModel.getCombinedData(month);
        res.json(results || { statistics: {}, priceRangeData: [], categoryData: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    listTransactions,
    getStatistics,
    getBarChart,
    getCategoryData,
    getCombinedData
};
