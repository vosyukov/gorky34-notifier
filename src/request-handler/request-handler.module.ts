import { forwardRef, Module } from '@nestjs/common';
import { RequestHandlerController } from './request-handler.controller';
import { RequestHandlerService } from './request-handler.service';
import { RequestEntity } from './dao/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VkApiModule } from '../vk-api/vk-api.module';
import { StatusCheckerModule } from '../status-cheker/status-checker.module';
import { EmailManagerModule } from '../email-manager/email-manager.module';

@Module({
  imports: [
    VkApiModule,
    TypeOrmModule.forFeature([RequestEntity]),
    StatusCheckerModule,
    EmailManagerModule,
  ],
  controllers: [RequestHandlerController],
  providers: [RequestHandlerService],
})
export class RequestHandlerModule {}
