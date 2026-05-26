import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoItem } from "../components/TodoItem";
import { parseNLTodo } from "../utils/nlParser";
import axiosClient from "../api/axiosClient";
import { Suggestions } from "../components/Suggestions";
import BalloonBackground from "@/components/ui/BalloonBackground";

export const TodoPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => (await axiosClient.get("/todos")).data
  });

  const [text, setText] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: any) =>
      (await axiosClient.post("/todos", data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todos"] })
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) =>
      (await axiosClient.patch(`/todos/${id}/toggle`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todos"] })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      (await axiosClient.delete(`/todos/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todos"] })
  });

  const addTodo = () => {
    if (!text.trim()) return;

    const parsed = parseNLTodo(text);

    createMutation.mutate(parsed);

    setText("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white p-6">

      {/* Animated Background */}
      <BalloonBackground />

      <div className="relative z-10 max-w-xl mx-auto mt-20 space-y-6">

        <h1
          className="text-4xl font-extrabold text-center
          text-transparent bg-clip-text
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
        >
          ✨ Today’s Smart Todo List
        </h1>

        {/* NL Input */}
        <div className="bg-[#091725]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="✨ Add tasks using natural language…"
            className="w-full bg-transparent outline-none text-slate-200"
          />

          <button
            onClick={addTodo}
            className="mt-3 px-4 py-2 rounded
              bg-gradient-to-r from-purple-400 to-pink-300
              text-black font-semibold"
          >
            Add Task
          </button>

          <Suggestions
            query={text}
            onPick={(title) => setText(title)}
          />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.map((todo: any) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={(id) => toggleMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};