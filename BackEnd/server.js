const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const initializeDatabase = require('./utils/initializeDatabase');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', transactionRoutes);

const PORT = 5001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase(); 
});
