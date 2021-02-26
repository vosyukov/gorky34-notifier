import { VkApiService } from '../vk-api/vk-api.service';
import { Injectable } from '@nestjs/common';
import { RequestStatus } from '../request-handler/request-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from '../request-handler/dao/request.entity';
import { Repository } from 'typeorm';
import { RequestManagerService } from '../request-manager/request-manager.service';
import { EmailSenderService } from '../email-manager/email-sender.service';

@Injectable()
export class StatusCheckerService {
  constructor(
    private readonly vkApiService: VkApiService,
    private readonly requestManagerService: RequestManagerService,
    private readonly emailSenderService: EmailSenderService,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {
    this.get();
  }
  public async get() {
    const managers = await this.vkApiService.getGroupManagers();
    const pendingTopics = await this.requestRepository.find({
      where: {
        status: RequestStatus.PENDING,
      },
    });

    for (const s of pendingTopics) {
      const comments = await this.vkApiService.getComments(s.topicId);
      for (const comment of comments) {
        for (const manager of managers) {
          if (
            comment.from_id === manager.id &&
            comment.text.toLowerCase() === 'ок'
          ) {
            console.log('OOOOOOOK');
            this.requestManagerService.changeStatus(
              s.id,
              RequestStatus.APPROVE,
            );
          }
        }
      }
    }

    const approveTopics = await this.requestRepository.find({
      where: {
        status: RequestStatus.APPROVE,
      },
    });

    for (const s of approveTopics) {
      this.emailSenderService.sendEmail('os123', s);
      this.requestManagerService.changeStatus(
        s.id,
        RequestStatus.WAITING_RESPONSE,
      );
    }
  }
}
