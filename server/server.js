import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import './config/instrument.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRouter.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import bodyParser from 'body-parser'; // ✅ raw body parser needed for Clerk

const app = express();

// ✅ Clerk webhook - must come FIRST and use raw body
app.post('/webhooks', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);

// ✅ Other middlewares AFTER webhook
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('API working'));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

Sentry.setupExpressErrorHandler(app);

// Connect DB & Cloudinary then start server
(async () => {
  await connectDB();
  await connectCloudinary();

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})();
