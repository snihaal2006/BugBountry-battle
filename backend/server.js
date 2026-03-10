const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Supabase config is loaded inside controllers

dotenv.config();
// no separate explicit connect needed

const app = express();

app.use(cors());
app.use(express.json());

// Load Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contest', require('./routes/contestRoutes'));
app.use('/api/submission', require('./routes/submissionRoutes'));

app.get('/', (req, res) => {
    res.send('BugBounty Battle API running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
