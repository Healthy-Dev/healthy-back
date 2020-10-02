import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Mail } from './mail.interface';
@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        type: process.env.EMAIL_AUTH_TYPE,
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_ACCESS_TOKEN,
        expires: process.env.EMAIL_TOKEN_EXPIRES,
      },
    });
  }

  async sendMail(mail: Mail): Promise<boolean> {
    const { to, subject, content } = mail;
    const from = `"${process.env.EMAIL_ALIAS}" <${process.env.EMAIL_USERNAME}>`;
    const options = {
      from,
      to,
      subject,
      html: content,
    };

    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return true;
  }
}
