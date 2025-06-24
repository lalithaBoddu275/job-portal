import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import './config/instrument.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controlers/webhooks.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API working'));
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  
app.post('/webhooks',clerkWebhooks)
Sentry.setupExpressErrorHandler(app);

(async () => {
  await connectDB();

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`); 
  });
})();
