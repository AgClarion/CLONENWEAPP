import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";
import { messageQueue, sendScheduledMessages } from "./queues";
const schedule  = require('node-schedule');
import * as cron from 'node-cron';
import EmailService from "./services/EmailService/EmailService";
import EmailAutomaticService from "./services/EmailService/EmailAutomaticService";



const sendScheduledEmails = async () => {
  const recipients  = ["renatocelo189@gmail.com", "renatosliphy@gmail.com"];
  console.log('Agendando envio de e-mails');
  for (const recipient of recipients) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        EmailAutomaticService.to = recipient;
        EmailAutomaticService.subject = "Teste 1";
        EmailAutomaticService.message = "Testando texto";
        EmailAutomaticService.sendMail();
        resolve();
      }, 100000); // Tempo de atraso em milissegundos (1 segundo neste exemplo)
    });
  }
  console.log('Emails agendados');
}

// Chame a função para agendar os e-mails
cron.schedule('5 * * * *', () => {
  sendScheduledEmails();
  });

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

app.set("queues", {
  messageQueue,
  sendScheduledMessages
});

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use("/public", express.static(uploadConfig.directory));
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
