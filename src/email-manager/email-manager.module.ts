import { Module } from '@nestjs/common';

import { SMTP_HOST, SMTP_PORT, EMAIL_LOGIN, EMAIL_PASSWORD } from './../env';
import { EmailManagerService } from './email-manager.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
          user: EMAIL_LOGIN,
          pass: EMAIL_PASSWORD,
        },
      },
      // preview: true,
    }),
  ],
  controllers: [],
  providers: [EmailManagerService, EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailManagerModule {}
