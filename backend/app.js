import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import routes from "./routes/index.js";
import errorHandler from "./utils/errorHandler.js";
import { generalLimiter } from "./utils/rateLimiter.js";
import { MESSAGES } from "./utils/setConstants.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: MESSAGES.EXPENSE_TACKER_API_RUNNING,
    });
});

app.use(errorHandler);

export default app;