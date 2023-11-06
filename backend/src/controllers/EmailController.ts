
import EmailService from "../services/EmailService/EmailService";


export const sendMail = async (req, res) => {
  const message = Object.assign({}, req.body);

  EmailService.to = message.to;
  EmailService.subject = message.subject;
  EmailService.message = message.message;
  let result = EmailService.sendMail();
  
  return res.status(200).json(result);
};
