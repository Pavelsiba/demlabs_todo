import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export class TodoDB extends Dexie {
  todos!: Table<Todo, number>;

  constructor() {
    super('todoDB');
    this.version(1).stores({
      todos: '++id, title, completed, createdAt'
    });
  }
}

export const db = new TodoDB();
