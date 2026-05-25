import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface DevUser {
  id: string;
  email: string;
  password: string;
  activityHistory: string[];
  resetToken?: string;
  resetTokenExpiry?: Date;
}

export interface DevTodo {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  completed: boolean;
  createdAt: Date;
}

interface DevStoreData {
  users: DevUser[];
  todos: DevTodo[];
}

const storePath = path.resolve(__dirname, "../../.dev-store.json");

const loadStore = (): DevStoreData => {
  try {
    if (!fs.existsSync(storePath)) {
      return { users: [], todos: [] };
    }

    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw) as DevStoreData;

    return {
      users: parsed.users || [],
      todos: (parsed.todos || []).map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }))
    };
  } catch {
    return { users: [], todos: [] };
  }
};

const data = loadStore();

export const devStore = {
  users: data.users,
  todos: data.todos,
  id: () => crypto.randomUUID(),
  save: () => {
    fs.writeFileSync(
      storePath,
      JSON.stringify({ users: devStore.users, todos: devStore.todos }, null, 2)
    );
  }
};
