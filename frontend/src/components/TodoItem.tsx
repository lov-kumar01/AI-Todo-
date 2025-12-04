import React from "react";
import { Timer } from "./Timer";
import { Trash2, CheckCircle2, Circle } from "lucide-react";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedMinutes?: number;
  createdAt: string;
}

export const TodoItem: React.FC<{
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ todo, onToggle, onDelete }) => {
  return (
    <div
      className="
        flex justify-between items-center p-5 rounded-2xl
        bg-gradient-to-br from-[#0d1b2a]/80 via-[#1B263B]/60 to-[#0A0F1E]/80
        border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.6)]
        backdrop-blur-xl
        hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(0,0,0,0.8)]
        transition-all duration-300 ease-out
      "
    >
      {/* Left Section */}
      <div className="flex flex-col gap-2 w-[80%]">
        
        {/* Title Row */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onToggle(todo._id)}
        >
          <div className="transition-all">
            {todo.completed ? (
              <CheckCircle2
                className="text-green-400 drop-shadow-[0_0_6px_rgba(0,255,0,0.4)]"
                size={22}
              />
            ) : (
              <Circle
                className="text-slate-400 group-hover:text-purple-300 transition"
                size={22}
              />
            )}
          </div>

          <h3
            className={`
              text-lg font-semibold tracking-wide 
              ${todo.completed 
                ? "line-through text-slate-500" 
                : "text-slate-100 group-hover:text-purple-200"
              }
              transition
            `}
          >
            {todo.title} ✨
          </h3>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="text-xs text-slate-400 ml-8 leading-relaxed">
            {todo.description}
          </p>
        )}

        {/* Date */}
        <p className="text-[11px] ml-8 text-slate-500">
          📅 Added on{" "}
          {new Date(todo.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
          })}
        </p>

        {/* Timer */}
        <div className="ml-8 mt-1">
          <Timer todoId={todo._id} minutes={todo.estimatedMinutes ?? 25} />
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(todo._id)}
        className="
          text-red-400 hover:text-red-300 
          hover:scale-125 active:scale-90
          transition-all duration-200
        "
      >
        <Trash2 size={24} />
      </button>
    </div>
  );
};
