import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsWebSocketGateway } from './notifications.gateway';
import { RedisService } from './redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationsService,
    NotificationsResolver,
    NotificationsWebSocketGateway,
    RedisService,
  ],
})
export class NotificationsModule {}
