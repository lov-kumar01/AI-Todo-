import { Request, Response } from "express";
import { Todo } from "../models/Todo";
import { User } from "../models/User";

// GET all todos
export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description, estimatedMinutes } = req.body;

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
    const userId = (req as any).userId;

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
    const userId = (req as any).userId;

    await Todo.deleteOne({ _id: req.params.id, userId });

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// SAVE USER ACTIONS (used for suggestions)
export const logEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title } = req.body;

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
    const userId = (req as any).userId;

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
