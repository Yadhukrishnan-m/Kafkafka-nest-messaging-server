import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageModel } from './model/message.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FailedMessage, FailedMessageModel } from './model/faildMessage.schema';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://yadhumon2003:%40Yadhu0755@cluster0.eb9ah.mongodb.net/kafka_message',
    ),

    // Register the Message schema in Mongoose
    MongooseModule.forFeature([{ name: Message.name, schema: MessageModel }]),
    MongooseModule.forFeature([
      { name: FailedMessage.name, schema: FailedMessageModel },
    ]),

    // Register Kafka client
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'client-b',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'client-b-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
