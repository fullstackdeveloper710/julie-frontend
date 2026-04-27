import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import v1Routes from './v1/routes/index.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
console.log("Environment:", process.env.PORT);
const server = http.createServer(app);

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import routes
app.use('/api/v1', v1Routes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});

export default app;
