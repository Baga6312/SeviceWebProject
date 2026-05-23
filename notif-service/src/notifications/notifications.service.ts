import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationsWebSocketGateway } from './notifications.gateway';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
    private wsGateway: NotificationsWebSocketGateway,
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    // Get all users from auth service
    let userIds: number[] = [input.userId];
    try {
      const res = await axios.post(`${process.env.AUTH_SERVICE || 'http://localhost:3001'}/graphql`, {
        query: `query { getUsers { id } }`
      });
      userIds = res.data.data.getUsers.map((u: any) => u.id);
    } catch (e) {
      console.error('Failed to fetch users:', e.message);
    }

    // Create one notification per user
    let saved: Notification | null = null;
    for (const userId of userIds) {
      const notif = this.repo.create({ ...input, userId });
      saved = await this.repo.save(notif);
    }

    // Broadcast to all via WebSocket
    this.wsGateway.broadcast({ ...input, userIds });
    return saved!;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async markAsRead(id: number): Promise<Notification | null> {
    await this.repo.update(id, { isRead: true });
    return this.repo.findOne({ where: { id } });
  }
}