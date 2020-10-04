import { Injectable, Logger } from '@nestjs/common';
import { verifyTemplate, resetPasswordTemplate } from './mail.templates';
import { MailService } from '../mail/mail.service';
import { Mail } from '../mail/mail.interface';
const mustache = require('mustache');
const mjml = require('mjml');
@Injectable()
export class MailTemplatesService {
  constructor(private mailService: MailService) {}

  async sendMailVerify(email: string, nameOrUsername: string, activationLink: string) {
    const templateData = {
      nameOrUsername,
      activationLink,
    };
    const mjmlTemplate = verifyTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html;
    const subject = 'Activación de cuenta';
    const to = email;
    const content = html;
    const mail: Mail = { to, subject, content };
    const sent = await this.mailService.sendMail(mail);
    return sent;
  }

  async sendMailResetPassword(email: string, nameOrUsername: string, resetPasswordLink: string) {
    const templateData = {
      nameOrUsername,
      resetPasswordLink,
    };
    const mjmlTemplate = resetPasswordTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html;
    const subject = 'Cambiá tu contraseña';
    const to = email;
    const content = html;
    const mail: Mail = { to, subject, content };
    const sent = await this.mailService.sendMail(mail);
    return sent;
  }
}
