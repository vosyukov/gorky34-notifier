import { Module } from '@nestjs/common';
import { StatusCheckerService } from './status-checker.service';
import { VkApiModule } from '../vk-api/vk-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from '../request-handler/dao/request.entity';
import { RequestManagerModule } from '../request-manager/request-manager.module';
import { EmailManagerModule } from '../email-manager/email-manager.module';

@Module({
  imports: [
    VkApiModule,
    TypeOrmModule.forFeature([RequestEntity]),
    RequestManagerModule,
    EmailManagerModule,
  ],
  controllers: [],
  providers: [StatusCheckerService],
  exports: [StatusCheckerService],
})
export class StatusCheckerModule {}
