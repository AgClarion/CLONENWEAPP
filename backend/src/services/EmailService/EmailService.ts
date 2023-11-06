import * as nodemailer from "nodemailer";
import { readFileSync } from 'fs';
import config from '../../config/email';

class Mail {

    constructor(
        public to?: string[],
        public subject?: string,
        public message?: string) { }


    sendMail() {

      // Leia o conteúdo do arquivo HTML
      const htmlContent = readFileSync(`src/config/html/index.html`, 'utf8');

      const htmlMessage = `
      <html>
          <body>
              <p>${this.message}</p>
              <p>Aqui está o conteúdo HTML incorporado:</p>
              <div style="border: 1px solid #ccc; padding: 10px;">
              ${htmlContent} <!-- Conteúdo HTML do arquivo incorporado aqui -->
              </div>
          </body>
      </html>
      `;


        let mailOptions = {
            from: "renatocelo189@gmail.com",
            to: this.to?.join(', '),
            subject: this.subject,
            html: htmlMessage
        };

        const transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.user,
                pass: config.password
            }
        });


        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return error;
            } else {
                return "E-mail enviado com sucesso!";
            }
        });
    }


}

export default new Mail;
