import express from 'express';
import cors from 'cors';
import authRoutes from './routers/auth.router.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/',authRoutes);
export {app};