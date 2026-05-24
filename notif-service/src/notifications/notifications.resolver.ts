import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private service: NotificationsService) {}

  @Mutation(() => Notification)
  sendNotification(@Args('input') input: CreateNotificationInput) {
    return this.service.create(input);
  }

  @Query(() => [Notification])
  getNotifications(@Args('userId', { type: () => Int }) userId: number) {
    return this.service.findByUser(userId);
  }

  @Mutation(() => Notification)
  markAsRead(@Args('id', { type: () => Int }) id: number) {
    return this.service.markAsRead(id);
  }

  @Mutation(() => Boolean)
    markAllAsRead(@Args('userId', { type: () => Int }) userId: number) {
    return this.service.markAllAsRead(userId);
}
}
