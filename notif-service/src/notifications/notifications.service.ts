import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationsWebSocketGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
    private wsGateway: NotificationsWebSocketGateway,
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const notif = this.repo.create(input);
    const saved = await this.repo.save(notif);
    this.wsGateway.broadcast(saved);
    return saved;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.repo.find({ where: { userId } });
  }

  async markAsRead(id: number): Promise<Notification | null> {
    await this.repo.update(id, { isRead: true });
    return this.repo.findOne({ where: { id } });
  }
}