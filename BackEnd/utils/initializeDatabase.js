const axios = require('axios');
const connectToDatabase = require('../models/db');

const initializeDatabase = async () => {
  try {
    // Axios with timeout and retry
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json',{timeout: 10000,});

    const db = await connectToDatabase();

    await db.collection('transactions').deleteMany({});
    console.log('Old data cleared');

    // Process data before inserting
    const processedData = data.map(item => ({
      ...item,
      dateOfSale: new Date(item.dateOfSale),
    }));

    // Insert new data into the database
    await db.collection('transactions').insertMany(processedData);
    console.log(`${data.length} records inserted into MongoDB`);
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
};

module.exports = initializeDatabase;
