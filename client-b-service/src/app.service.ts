import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './model/message.schema';
import {
  FailedMessage,
  FailedMessageDocument,
} from './model/faildMessage.schema';
import { AppGateway } from './app.gateway';

interface IMessage {
  from: string;
  to: string;
  message: string;
}

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(FailedMessage.name)
    private readonly failedMessageModel: Model<FailedMessageDocument>,
    private readonly gateway: AppGateway,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  private readonly MAX_RETRY = 3;
  private readonly RETRY_DELAY_MS = 2000;

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handleMessage(payload: IMessage, retryCount = 0): Promise<void> {
    try {
      if (payload.to === 'clientB') {
        console.log('Received message for clientB:', payload);
        // sending to client through socket
        this.gateway.sendMessageToClientB({
          ...payload,
          createdAt: new Date().toISOString(),
        });
        const createdMessage = new this.messageModel(payload);
        await createdMessage.save();
      } else {
        console.log('Ignored message not meant for clientB:', payload);
      }
    } catch (error) {
      const errorMessage: string =
        error instanceof Error ? error.message : 'Unknown error';
      if (retryCount < this.MAX_RETRY) {
        console.log(`Retrying message, attempt ${retryCount + 1}`);
        await this.delay(this.RETRY_DELAY_MS);
        await this.handleMessage(payload, retryCount + 1);
      } else {
        console.error('Max retries reached. Logging message to DLQ ', payload);
        const failedMessage = new this.failedMessageModel({
          ...payload,
          errorMessage,
          failedAt: new Date(),
        });
        await failedMessage.save();
      }
    }
  }
  async getAllMessages() {
    return this.messageModel.find({ to: 'clientB' }).sort({ createdAt: -1 });
  }
}
