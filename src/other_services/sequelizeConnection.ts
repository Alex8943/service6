import {Sequelize} from "sequelize"; 
import { config } from "../../config";

const dbConfig = config.dbConfig;

console.log("Database Configuration:", dbConfig);

const sequelize = new Sequelize(
    dbConfig.mysql.mysql_database!,
    dbConfig.mysql.mysql_user!,
    dbConfig.mysql.mysql_password!,
    {
        host: dbConfig.mysql.mysql_host,
        dialect: "mysql",
        port: dbConfig.mysql.mysql_port,
        logging: console.log, // Log SQL queries
    }
);

sequelize.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((error) =>
        console.error("Unable to connect to the database:", error)
    );




export const sequelizeAuth = async () => {sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));
};

export const sequelizeSync = async () => {await sequelize.sync()
    .then(() => console.log('Seq model synced with the database'))
    .catch((error) => console.error('Error syncing models:', error));
};

// Function to authenticate and sync the database
export const sequelizeInit = async () => {
    try {
        console.log("Connecting to the database...");
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        console.log("Synchronizing database schema...");
        await sequelize.sync({ alter: true }); // Adjust schema to match models
        console.log("Database schema synchronized successfully.");
    } catch (error) {
        console.error("Error connecting or synchronizing the database:", error);
        throw error;
    }
};

export default sequelize;