import express from "express";
import handleError from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from 'morgan';
import chatRouter from "./routes/chat.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

//Routes 
app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);


app.use(handleError);

export default app;