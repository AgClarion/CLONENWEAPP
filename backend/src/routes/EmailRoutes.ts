import express from "express";
import  * as EmailController  from "../controllers/EmailController";

export const emailRoutes = express.Router();

emailRoutes.post("/", EmailController.sendMail);


export default emailRoutes;
