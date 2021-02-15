import { Module } from '@nestjs/common';

import { RequestManagerService } from './request-manager.service';
import { VkApiModule } from '../vk-api/vk-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from '../request-handler/dao/request.entity';

@Module({
  imports: [VkApiModule, TypeOrmModule.forFeature([RequestEntity])],
  controllers: [],
  providers: [RequestManagerService],
  exports: [RequestManagerService],
})
export class RequestManagerModule {}
