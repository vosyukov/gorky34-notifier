import { Module } from '@nestjs/common';

import { EmailManagerService } from './email-manager.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.yandex.com',
        port: 465,
        secure: true,
        auth: {
          user: 'o123',
          pass: '123',
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
