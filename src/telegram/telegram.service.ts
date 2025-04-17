// src/telegram/telegram.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { TodoService } from '../todo/todo.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private readonly todoService: TodoService,
    private readonly configService: ConfigService,
  ) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    console.log('TELEGRAM_BOT_TOKEN:', botToken); // Tokenni konsolga chiqaramiz
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN topilmadi');
    }
    this.bot = new Telegraf(botToken);
  }

  onModuleInit() {
    this.setupBot();
    this.bot.launch().then(() => {
      console.log('Telegram bot ishga tushdi');
    });
  }

  private setupBot() {
    this.bot.start((ctx) => {
      ctx.reply('Todo Botga xush kelibsiz! /create yoki /findall dan foydalaning.');
    });

    this.bot.command('create', (ctx) => {
      ctx.reply('Todo ma’lumotlarini quyidagi formatda kiriting: /add sarlavha, tavsif, muallif, boshlanish_sanasi (YYYY-MM-DD), tugash_sanasi (YYYY-MM-DD)');
    });


    this.bot.command('add', (ctx) => {
    const args = ctx.message.text.split(',').map((arg) => arg.trim());
    
    console.log('Kiritilgan args:', args); 
    

    if (args.length !== 6) {
      return ctx.reply(
        `Noto‘g‘ri maydonlar soni. Kiritilgan: ${args.length - 1}, kutilgan: 5. Quyidagicha kiriting: /add sarlavha, tavsif, muallif, boshlanish_sanasi (YYYY-MM-DD), tugash_sanasi (YYYY-MM-DD)\nMasalan: /add Do‘kon, Non va sut olish, Ali, 2025-04-18, 2025-04-19`
      );
    }
  
    const [, title, description, author, startDateStr, endDateStr] = args;
  
    console.log('title:', title); 
    console.log('description:', description);
    console.log('author:', author);
    console.log('startDateStr:', startDateStr);
    console.log('endDateStr:', endDateStr);
  

    if (!title || !description || !author || !startDateStr || !endDateStr) {
      return ctx.reply(
        `Barcha maydonlar to‘ldirilishi kerak. Hozirgi qiymatlar:\nSarlavha: ${title || 'bo‘sh'}\nTavsif: ${description || 'bo‘sh'}\nMuallif: ${author || 'bo‘sh'}\nBoshlanish sanasi: ${startDateStr || 'bo‘sh'}\nTugash sanasi: ${endDateStr || 'bo‘sh'}\nQuyidagicha kiriting: /add sarlavha, tavsif, muallif, boshlanish_sanasi (YYYY-MM-DD), tugash_sanasi (YYYY-MM-DD)`
      );
    }
  
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
  
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return ctx.reply(
        `Noto‘g‘ri sana formati. Sanalar YYYY-MM-DD formatida bo‘lishi kerak.\nBoshlanish sanasi: ${startDateStr}\nTugash sanasi: ${endDateStr}\nMasalan: 2025-04-18`
      );
    }
  
    const todo = this.todoService.create(
      title,
      description,
      author,
      startDate,
      endDate,
    );
    ctx.reply(`Todo yaratildi: #${todo.id} ${todo.title}`);
  });

    this.bot.command('findall', (ctx) => {
      const todos = this.todoService.findAll();
      if (todos.length === 0) {
        return ctx.reply('Todo topilmadi.');
      }

      const todoList = todos.map(
        (todo) =>
          `#${todo.id} ${todo.title}\n${todo.description}\nMuallif: ${todo.author}\nBoshlanish: ${todo.startDate.toISOString().split('T')[0]} Tugash: ${todo.endDate.toISOString().split('T')[0]}`,
      );
      ctx.reply(`Barcha todolar:\n\n${todoList.join('\n\n')}`);
    });

    this.bot.command('delete', (ctx) => {
      const args = ctx.message.text.split(' ').map((arg) => arg.trim());
      if (args.length !== 2) {
        return ctx.reply('Foydalanish: /delete <id>');
      }

      const id = parseInt(args[1], 10);
      const success = this.todoService.delete(id);
      if (success) {
        ctx.reply(`Todo #${id} o‘chirildi.`);
      } else {
        ctx.reply(`Todo #${id} topilmadi.`);
      }
    });

    this.bot.command('update', (ctx) => {
      const args = ctx.message.text.split(',').map((arg) => arg.trim());
      if (args.length !== 6) {
        return ctx.reply('Foydalanish: /update id, sarlavha, tavsif, muallif, boshlanish_sanasi (YYYY-MM-DD), tugash_sanasi (YYYY-MM-DD)');
      }

      const [_, idStr, title, description, author, startDateStr, endDateStr] = args;
      const id = parseInt(idStr, 10);
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return ctx.reply('Noto‘g‘ri sana formati. YYYY-MM-DD formatidan foydalaning.');
      }

      const updatedTodo = this.todoService.update(id, {
        title,
        description,
        author,
        startDate,
        endDate,
      });

      if (updatedTodo) {
        ctx.reply(`Todo #${id} yangilandi.`);
      } else {
        ctx.reply(`Todo #${id} topilmadi.`);
      }
    });

    this.bot.command('back', (ctx) => {
      ctx.reply('Asosiy menyuga qaytish. /create yoki /findall dan foydalaning.');
    });
  }
}