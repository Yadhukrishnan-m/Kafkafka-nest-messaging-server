import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Connect to Kafka broker when app starts
  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  sendMessage(payload: any) {
    console.log(' Sending Kafka message:', payload);
    return this.kafkaClient.emit('client-messages', payload);
  }
}
