import { Module } from '@nestjs/common';

import { VkApiService } from './vk-api.service';

@Module({
  imports: [],
  controllers: [],
  providers: [VkApiService],
  exports: [VkApiService],
})
export class VkApiModule {}
