import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("----------------------------------");
        console.log("✅ MySQL Connected Successfully");

        await sequelize.sync();
        console.log("✅ Database Synced");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server Startup Error:", error);
        process.exit(1);
    }
};

startServer();