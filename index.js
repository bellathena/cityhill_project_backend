require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const roomRoutes = require('./src/routes/room');
const roomTypeRoutes = require('./src/routes/roomType');
const customerRoutes = require('./src/routes/customer');
const dailyBookingRoutes = require('./src/routes/dailyBooking');
const monthlyContractRoutes = require('./src/routes/monthlyContract');
const invoiceRoutes = require('./src/routes/invoice');
const paymentRoutes = require('./src/routes/payment');
const meterReadingRoutes = require('./src/routes/meterReading');
const errorHandler = require('./src/middleware/errorHandler');
const config = require('./src/config/server');

const app = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Request logging (optional, can be enhanced with morgan)
 */
if (config.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/daily-bookings', dailyBookingRoutes);
app.use('/api/monthly-contracts', monthlyContractRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/meter-readings', meterReadingRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✓ Backend running on port ${PORT} (${config.nodeEnv})`);
});