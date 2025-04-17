
import { Injectable } from '@nestjs/common';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  create(
    title: string,
    description: string,
    author: string,
    startDate: Date,
    endDate: Date,
  ): Todo {
    const todo = new Todo(
      this.idCounter++,
      title,
      description,
      author,
      startDate,
      endDate,
    );
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  update(id: number, updatedTodo: Partial<Todo>): Todo | undefined {
    const todo = this.findOne(id);
    if (todo) {
      Object.assign(todo, updatedTodo);
    }
    return todo;
  }

  delete(id: number): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}