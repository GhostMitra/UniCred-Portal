import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import credentialsRouter from './routes/credentials';
import authRouter from './routes/auth';
import metricsRouter from './routes/metrics';
import seedsRouter from './routes/seeds';
import studentsRouter from './routes/students';
import { createDidFromSeed } from './utils/did';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Initialize issuer DID and keys from seed
(async () => {
  const seed = process.env.DID_SEED || 'dev_seed_32_bytes_minimum_dev_seed_123456';
  const { did, jwk } = await createDidFromSeed(seed);
  app.set('issuerDid', did);
  app.set('issuerJwk', jwk);
})();

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/credentials', credentialsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/seed', seedsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`VisionX backend listening on :${port}`);
});

