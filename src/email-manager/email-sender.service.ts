import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RequestEntity } from '../request-handler/dao/request.entity';

@Injectable()
export class EmailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(to: string, request: RequestEntity): Promise<void> {
    await this.mailerService.sendMail({
      to: to,
      from: 'o123',
      subject: `Заявка №${request.id} ${request.title}`,
      text: `${request.description}`,
    });
  }
}
