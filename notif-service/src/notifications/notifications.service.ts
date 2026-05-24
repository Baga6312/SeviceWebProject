import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationsWebSocketGateway } from './notifications.gateway';
import { RedisService } from './redis.service';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
    private wsGateway: NotificationsWebSocketGateway,
    private redisService: RedisService,
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    let userIds: number[] = [input.userId];
    try {
      const res = await axios.post(
        `${process.env.AUTH_SERVICE || 'http://localhost:3001'}/graphql`,
        {
          query: `query { getUsers { id } }`,
        },
      );
      userIds = res.data.data.getUsers.map((u: any) => u.id);
    } catch (e) {
      if (e instanceof Error) {
        console.error('Failed to fetch users:', e.message);
      } else {
        console.error('Failed to fetch users:', e);
      }
    }

    let saved: Notification | null = null;
    for (const userId of userIds) {
      const notif = this.repo.create({ ...input, userId });
      saved = await this.repo.save(notif);
      // Invalidate cache for this user
      await this.redisService.del(`notifs:${userId}`);
    }

    this.wsGateway.broadcast({ ...input, userIds });
    return saved!;
  }

  async markAllAsRead(userId: number): Promise<boolean> {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
    await this.redisService.del(`notifs:${userId}`);
    return true;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    const cacheKey = `notifs:${userId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] notifs:${userId}`);
      return JSON.parse(cached);
    }
    console.log(`[CACHE MISS] notifs:${userId}`);
    const notifs = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    await this.redisService.set(cacheKey, JSON.stringify(notifs), 60);
    return notifs;
  }
  async markAsRead(id: number): Promise<Notification | null> {
    await this.repo.update(id, { isRead: true });
    const notif = await this.repo.findOne({ where: { id } });
    if (notif) await this.redisService.del(`notifs:${notif.userId}`);
    return notif;
  }
}
