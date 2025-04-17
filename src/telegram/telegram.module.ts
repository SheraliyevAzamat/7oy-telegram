import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TodoModule } from '../todo/todo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TodoModule, ConfigModule], 
  providers: [TelegramService],
})
export class TelegramModule {}