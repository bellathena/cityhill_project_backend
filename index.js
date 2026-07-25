import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import roomRoutes from './src/routes/room.js';
import roomTypeRoutes from './src/routes/roomType.js';
import customerRoutes from './src/routes/customer.js';
import dailyBookingRoutes from './src/routes/dailyBooking.js';
import monthlyContractRoutes from './src/routes/monthlyContract.js';
import invoiceRoutes from './src/routes/invoice.js';
import paymentRoutes from './src/routes/payment.js';
import moveOutSettlementRoutes from './src/routes/moveOutSettlement.js';
import utilitiesRoutes from './src/routes/utilities.js';
import utilityUsageRoutes from './src/routes/utilityUsage.js';
import errorHandler from './src/middleware/errorHandler.js';
import config from './src/config/server.js';

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
app.use('/api/move-out-settlements', moveOutSettlementRoutes);
app.use('/api/utilities', utilitiesRoutes);
app.use('/api/utility-usages', utilityUsageRoutes);

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
