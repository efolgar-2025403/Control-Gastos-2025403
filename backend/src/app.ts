import express from 'express';
import cors from 'cors';

import categoryRoutes from './modules/category/routes/category.routes.js';
import expenseRoutes from './modules/expense/routes/expense.routes.js';
import authRoutes from './modules/auth/routes/auth.routes.js';

import {
  authenticateToken,
  AuthenticatedRequest
} from './modules/auth/middlewares/auth.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Control-Gastos API is running'
  });
});

app.use('/api/auth', authRoutes);

app.get(
  '/api/auth/me',
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      user: req.user
    });
  }
);

app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);

export default app;