import express from 'express';
import cors from 'cors';
import logger from './other_services/winstonLogger';
import reviewRouter from './routes/reviewRouter';
import {testDBConnection} from './db_service/db_connection';
import { sequelizeAuth } from './other_services/sequelizeConnection';
import { setupQueues } from "./other_services/rabbitMQ";

const app = express();

app.use(cors());

app.use(express.json()); // for parsing application/json

//testDBConnection();
//createBackup();


app.use(reviewRouter)

process.on('SIGINT', () => {
    logger.end();
    console.log('See ya later silly');
    process.exit(0);
  });

app.listen(3006, async () => {
    //await setupQueues();
    console.log("Server6 is running on port 3006");
});

