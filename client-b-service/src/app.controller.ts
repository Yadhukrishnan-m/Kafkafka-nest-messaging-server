import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
interface IMessage {
  from: string;
  to: string;
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('messages')
  async getAllMessages() {
    return this.appService.getAllMessages();
  }

  @MessagePattern('client-messages')
  async consumeMessage(@Payload() message: IMessage) {
    await this.appService.handleMessage(message);
  }
}
