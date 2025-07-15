import { db } from '../store/todoDB';
import type { Todo } from '../store/todoDB';

export async function getTodos(): Promise<Todo[]> {
  return db.todos.toArray();
}

export async function addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<number> {
  return db.todos.add({ ...todo, completed: false, createdAt: new Date() });
}

export async function updateTodo(id: number, updates: Partial<Todo>): Promise<number> {
  return db.todos.update(id, updates);
}

export async function deleteTodo(id: number): Promise<void> {
  await db.todos.delete(id);
}
