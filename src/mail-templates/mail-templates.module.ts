import { Module } from '@nestjs/common';
import { MailTemplatesService } from './mail-templates.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [MailTemplatesService],
  exports: [MailTemplatesService],
})
export class MailTemplatesModule {}
