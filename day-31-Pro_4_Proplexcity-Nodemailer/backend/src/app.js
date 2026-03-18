import express from "express";
import handleError from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

//Routes 
app.use('/api/auth', authRouter);


app.use(handleError);

export default app;