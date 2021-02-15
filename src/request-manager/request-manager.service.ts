import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from '../request-handler/dao/request.entity';
import { getManager, Repository } from 'typeorm';
import { RequestStatus } from '../request-handler/request-status.enum';
import { VkApiService } from '../vk-api/vk-api.service';

@Injectable()
export class RequestManagerService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    private readonly vkApiService: VkApiService,
  ) {}

  public async changeStatus(id: number, status: RequestStatus): Promise<void> {
    await getManager().transaction(async (t) => {
      await t.update<RequestEntity>(
        RequestEntity,
        { id: id },
        { status: status },
      );

      const request = await t.findOne(RequestEntity, id);

      await this.vkApiService.editTopic(
        request.topicId,
        this.generateTopicTitle(request),
      );
    });
  }

  public generateTopicTitle(request: RequestEntity): string {
    let status = '';
    if (request.status === RequestStatus.PENDING) {
      status = '[Ожидание]';
    } else if (request.status === RequestStatus.APPROVE) {
      status = '[Передача в УК]';
    } else if (request.status === RequestStatus.DECLINE) {
      status = '[Оклонено]';
    } else if (request.status === RequestStatus.WAITING_RESPONSE) {
      status = '[Ожидание ответа от УК]';
    }

    return `${status} № ${request.id} ${request.title}`;
  }
}
