import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestHandlerModule } from './request-handler/request-handler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from './request-handler/dao/request.entity';
import { StatusCheckerModule } from './status-cheker/status-checker.module';

@Module({
  imports: [
    RequestHandlerModule,
    StatusCheckerModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db/db.sql',
      entities: [RequestEntity],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
