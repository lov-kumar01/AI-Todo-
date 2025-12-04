import { z } from "zod";

/* ---------------------------
   BASE TODO SCHEMA
---------------------------- */
export const todoSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean()
});

export type Todo = z.infer<typeof todoSchema>;

/* ---------------------------
   CREATE TODO
---------------------------- */
export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional()
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

/* ---------------------------
   UPDATE TODO
---------------------------- */
export const updateTodoSchema = createTodoSchema.extend({
  completed: z.boolean().optional()
});

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

/* ---------------------------
   TODO LIST RESPONSE
---------------------------- */
export const todoListSchema = z.array(todoSchema);
