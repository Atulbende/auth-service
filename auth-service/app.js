import express from 'express';
import cors from 'cors';
// const authRoutes=require('./routers/auth.router.js');

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/v1/auth',authRoutes);
export {app};