// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
      ignoreEnvFile: false, 
    }),
    TelegramModule,
    TodoModule,
  ],
})
export class AppModule {}