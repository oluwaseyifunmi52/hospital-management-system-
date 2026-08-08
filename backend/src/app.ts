import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import doctorRoutes from './routes/doctor.routes';
import patientRoutes from './routes/patient.routes';
import appointmentRoutes from './routes/appointment.routes';
import laboratoryRoutes from './routes/laboratory.routes';
import pharmacyRoutes from './routes/pharmacy.routes';
import billingRoutes from './routes/billing.routes';
import wardRoutes from './routes/ward.routes';
import notificationRoutes from './routes/notification.routes';
import nursingRoutes from './routes/nursing.routes';
import medicalRecordRoutes from './routes/medical-record.routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'SmartCare API is running' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/laboratory', laboratoryRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/wards', wardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/nursing', nursingRoutes);
app.use('/api/v1/medical-records', medicalRecordRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
