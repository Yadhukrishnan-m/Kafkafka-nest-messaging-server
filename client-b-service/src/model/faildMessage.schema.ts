import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type FailedMessageDocument = FailedMessage & Document;

@Schema()
export class FailedMessage {
  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  message: string;

  @Prop()
  errorMessage: string;

  @Prop()
  failedAt: Date;
}

export const FailedMessageModel = SchemaFactory.createForClass(FailedMessage);
