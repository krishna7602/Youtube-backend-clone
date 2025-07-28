import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthcheckrouter from './routes/healthcheck.routes.js';
import userRoute from './routes/user.routes.js'

const app = express();

app.use(
    cors({
        origin: process.env.CROSS_ORIGIN,
        credentials: true
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser())

// Mount healthcheck router
app.use("/api/v1/healthcheck", healthcheckrouter);
app.use("/api/v1/users",userRoute)
app.use("/api/v1/users",userRoute)

export { app };
