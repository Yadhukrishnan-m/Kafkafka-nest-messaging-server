/* eslint-disable @typescript-eslint/no-unsafe-call */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  sendMessageToClientB(message: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.server.emit('newMessage', message);
  }
}
