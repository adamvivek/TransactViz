const connectToDatabase = require('./db');

// Helper function to get the date range for a given month (start and end)
const getDateRangeForMonth = (month) => {
    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);  // Last day of the month
    endDate.setHours(23, 59, 59, 999);  // End of the day
    return { startDate, endDate };
};

// Fetch transactions with pagination
const getTransactions = async (filter, page, limit) => {
    const skip = (page - 1) * limit;
    const db = await connectToDatabase();
    return await db.collection('transactions').find(filter).skip(skip).limit(limit).toArray();
};

// Get statistics for a specific month (total sale, sold, and unsold items)
const getStatistics = async (month) => {
    const db = await connectToDatabase();
    const { startDate, endDate } = getDateRangeForMonth(month);

    try {
        const [stats] = await db.collection('transactions').aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: null,
                    totalSale: { $sum: '$price' },
                    totalSold: { $sum: { $cond: ['$sold', 1, 0] } },
                    totalNotSold: { $sum: { $cond: ['$sold', 0, 1] } }
                }
            },
            { $project: { _id: 0, totalSale: 1, totalSold: 1, totalNotSold: 1 } }
        ]).toArray();
        return stats || {};  // Return stats or empty object
    } catch (err) {
        console.error("Error fetching statistics:", err);
        throw err;
    }
};

// Get price range data for a specific month
const getPriceRangeData = async (month) => {
    const db = await connectToDatabase();
    const { startDate, endDate } = getDateRangeForMonth(month);

    try {
        const priceRanges = await db.collection('transactions').aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: '901-above',
                    output: { itemCount: { $sum: 1 } }
                }
            }
        ]).toArray();
        return priceRanges || [];  // Return price ranges or empty array
    } catch (err) {
        console.error("Error fetching price range data:", err);
        throw err;
    }
};

// Get category data for a specific month (number of items per category)
const getCategoryData = async (month) => {
    const db = await connectToDatabase();
    const { startDate, endDate } = getDateRangeForMonth(month);

    try {
        const categories = await db.collection('transactions').aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: '$category', itemCount: { $sum: 1 } } }
        ]).toArray();
        return categories || [];  // Return categories or empty array
    } catch (err) {
        console.error("Error fetching category data:", err);
        throw err;
    }
};

// Get all combined data: statistics, price range, and category data
const getCombinedData = async (month) => {
    const [statistics, priceRangeData, categoryData] = await Promise.all([
        getStatistics(month),
        getPriceRangeData(month),
        getCategoryData(month)
    ]);
    return { statistics, priceRangeData, categoryData };
};

module.exports = {
    getTransactions,
    getStatistics,
    getPriceRangeData,
    getCategoryData,
    getCombinedData
};
