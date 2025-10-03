require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth.Routes');
const adminRoutes = require('./routes/admin.Routes');

const app = express();
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
