
import dotenv from "dotenv";
import mysql2 from "mysql2";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize } from "sequelize";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caPath = path.resolve(__dirname, "../certs/ca.pem");
const caCertificate = fs.readFileSync(caPath, "utf8");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "mysql",
        dialectModule: mysql2,
        logging: false,
        dialectOptions: {
            ssl: {
                ca: caCertificate,
                rejectUnauthorized: true,
            },
        },
    }
);

export default sequelize;