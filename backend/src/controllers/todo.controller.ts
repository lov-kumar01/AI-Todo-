import { Request, Response } from "express";
import mongoose from "mongoose";
import { Todo } from "../models/Todo";
import { User } from "../models/User";
import { devStore } from "../utils/devStore";

const getUserId = (req: Request) => req.user!.userId;
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET all todos
export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!isDbConnected()) {
      const todos = devStore.todos
        .filter((todo) => todo.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return res.json(todos);
    }

    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { title, description, estimatedMinutes } = req.body;

    if (!isDbConnected()) {
      const newTodo = {
        _id: devStore.id(),
        userId,
        title,
        description,
        estimatedMinutes,
        completed: false,
        createdAt: new Date()
      };

      devStore.todos.push(newTodo);
      devStore.save();
      return res.status(201).json(newTodo);
    }

    const newTodo = await Todo.create({
      userId,
      title,
      description,
      estimatedMinutes,
      createdAt: new Date()
    });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Could not create todo" });
  }
};

// TOGGLE completed/unfinished
export const toggleTodo = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!isDbConnected()) {
      const todo = devStore.todos.find(
        (item) => item._id === req.params.id && item.userId === userId
      );

      if (!todo) return res.status(404).json({ message: "Todo not found" });

      todo.completed = !todo.completed;
      devStore.save();
      return res.json(todo);
    }

    const todo = await Todo.findOne({ _id: req.params.id, userId });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
};

// DELETE todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!isDbConnected()) {
      const index = devStore.todos.findIndex(
        (todo) => todo._id === req.params.id && todo.userId === userId
      );

      if (index >= 0) {
        devStore.todos.splice(index, 1);
        devStore.save();
      }

      return res.json({ message: "Todo deleted" });
    }

    await Todo.deleteOne({ _id: req.params.id, userId });

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// SAVE USER ACTIONS (used for suggestions)
export const logEvent = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { title } = req.body;

    if (!isDbConnected()) {
      const user = devStore.users.find((item) => item.id === userId);
      user?.activityHistory.push(title);
      devStore.save();

      return res.json({ message: "Event logged" });
    }

    await User.updateOne(
      { _id: userId },
      { $push: { activityHistory: title } }
    );

    res.json({ message: "Event logged" });
  } catch (err) {
    res.status(500).json({ message: "Logging failed" });
  }
};

// SUGGEST SIMILAR TASKS BASED ON HISTORY
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!isDbConnected()) {
      const user = devStore.users.find((item) => item.id === userId);
      const history = user?.activityHistory || [];

      if (history.length === 0) return res.json([]);

      const freq: Record<string, number> = {};
      history.forEach((task) => {
        const keyword = task.split(" ")[0].toLowerCase();
        freq[keyword] = (freq[keyword] || 0) + 1;
      });

      const mostUsed = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

      return res.json([
        `Finish pending ${mostUsed} tasks`,
        `Plan your next ${mostUsed} related work`,
        `Review old ${mostUsed} notes`
      ]);
    }

    const user = await User.findById(userId);

    const history: string[] = user?.activityHistory || [];

    if (history.length === 0)
      return res.json([]);

    // Pick the most common keyword
    const freq: Record<string, number> = {};
    history.forEach(task => {
      const keyword = task.split(" ")[0].toLowerCase(); // first word
      freq[keyword] = (freq[keyword] || 0) + 1;
    });

    const mostUsed = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

    const suggestions = [
      `Finish pending ${mostUsed} tasks`,
      `Plan your next ${mostUsed} related work`,
      `Review old ${mostUsed} notes`
    ];

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: "Suggestion failed" });
  }
};
