
import serverless from "serverless-http";
import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const expressHandler = serverless(app);

let databaseConnection;

async function connectDatabase() {
    if (!databaseConnection) {
        databaseConnection = sequelize.authenticate().catch((error) => {
            databaseConnection = undefined;
            throw error;
        });
    }

    return databaseConnection;
}

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectDatabase();

    return expressHandler(event, context);
};