import nodemailer from "nodemailer";
import fs from "fs/promises";
import Handlebars from "handlebars";

interface IEmailer {
  to: string;
  subject: string;
  pathToHtml: string;
  replacements?: Record<string, any>;
}

const emailer = async (options: IEmailer) => {
  const { to, subject, pathToHtml, replacements } = options;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gangsar.purwadhika@gmail.com",
        pass: "inhs qmno ofdq ztym",
      },
      logger: true,
    });

    const template = await fs.readFile(pathToHtml, {
      encoding: "utf-8",
    });

    const compiledTemplate = Handlebars.compile(template);

    // replacements = {name: "Test"}
    const html = compiledTemplate(replacements);

    const message = {
      from: "Gangsar Aryo <gangsar.purwadhika@gmail.com>",
      to,
      html,
      subject,
    };

    await transporter.sendMail(message);

    return {
      status: "SUCCESS",
      message: "Send email successully",
    };
  } catch (error) {
    console.log("Emailer Error : ", error);
  }
};

export default emailer;
