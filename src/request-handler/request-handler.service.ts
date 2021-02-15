import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { RequestEntity } from './dao/request.entity';
import { RequestStatus } from './request-status.enum';
import { VkApiService } from '../vk-api/vk-api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestHandlerService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    private readonly vkApiService: VkApiService,
  ) {}

  public async create(
    userId: string,
    phoneNumber: string,
    apartmentNumber: string,
    title: string,
    description: string,
  ): Promise<any> {
    await getManager().transaction(async (t) => {
      const result = await t.insert<RequestEntity>(RequestEntity, {
        userId,
        phoneNumber,
        apartmentNumber,
        title,
        description,
        status: RequestStatus.PENDING,
      });

      const id = result.identifiers[0].id;

      const request = await t.findOne(RequestEntity, id);

      const topicId = await this.vkApiService.createTopic(
        this.generateTopicTitle(request),
        `${title}\n Инициатор кв. ${apartmentNumber}\n  Описание: ${description} \n Статус: ожидание подтверждения`,
      );

      await t.update<RequestEntity>(
        RequestEntity,
        { id: id },
        { topicId: topicId },
      );
    });
  }

  public generateTopicTitle(request: RequestEntity): string {
    let status = '';
    if (request.status === RequestStatus.PENDING) {
      status = '[Ожидание]';
    } else if (request.status === RequestStatus.APPROVE) {
      status = '[Ожидание ответа от УК]';
    } else if (request.status === RequestStatus.DECLINE) {
      status = '[Оклонено]';
    }

    return `${status} № ${request.id} ${request.title}`;
  }
}
