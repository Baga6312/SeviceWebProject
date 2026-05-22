import {WebSocketGateway,WebSocketServer,} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({cors: { origin: '*' },})

export class NotificationsWebSocketGateway {
  @WebSocketServer()
  server: Server;

  broadcast(notification: any) {
    this.server.emit('notification', notification);
  }
}