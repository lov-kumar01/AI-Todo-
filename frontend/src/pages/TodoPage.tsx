import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { TodoItem } from "../components/TodoItem";
import { Suggestions } from "../components/Suggestions";
import { parseNLTodo } from "../utils/nlParser";
import axiosClient from "../api/axiosClient";
import BalloonBackground from "@/components/ui/BalloonBackground";
import { useAuthStore } from "../store/authStore";

export const TodoPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Authentication
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // User menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Todo input
  const [text, setText] = useState("");

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get todos
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axiosClient.get("/todos");
      return response.data;
    },
  });

  // Create todo
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosClient.post("/todos", data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  // Toggle todo
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.patch(
        `/todos/${id}/toggle`
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  // Delete todo
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/todos/${id}`);

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  // Add todo
  const addTodo = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    const parsedTodo = parseNLTodo(trimmedText);

    createMutation.mutate(parsedTodo);

    setText("");
  };

  // Logout
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    queryClient.clear();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white p-6">
      {/* Animated Background */}
      <BalloonBackground />

      {/* ================= USER MENU ================= */}
      <div
        ref={profileRef}
        className="absolute top-5 right-5 z-50"
      >
        {/* User Button */}
        <button
          type="button"
          onClick={() => setIsProfileOpen((previous) => !previous)}
          aria-label="Open user menu"
          aria-expanded={isProfileOpen}
          className="
            w-11 h-11
            rounded-full
            flex items-center justify-center
            bg-white/10
            backdrop-blur-xl
            border border-white/20
            shadow-lg
            hover:bg-white/20
            hover:scale-105
            transition-all duration-200
          "
        >
          <User size={21} />
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div
            className="
              absolute
              right-0
              mt-3
              w-72
              rounded-2xl
              bg-slate-950/75
              backdrop-blur-2xl
              border border-white/15
              shadow-2xl
              overflow-hidden
              animate-in
              fade-in
              zoom-in-95
              duration-150
            "
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-11 h-11
                    rounded-full
                    flex items-center justify-center
                    bg-gradient-to-br
                    from-purple-500
                    to-pink-400
                    text-white
                    shadow-lg
                  "
                >
                  <User size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-400">
                    Signed in as
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-white
                      truncate
                    "
                    title={user?.email}
                  >
                    {user?.email || "User"}
                  </p>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="
                    ml-auto
                    text-gray-400
                    hover:text-white
                    transition
                  "
                  aria-label="Close user menu"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex items-center gap-3
                  px-3 py-3
                  rounded-xl
                  text-red-300
                  hover:text-red-200
                  hover:bg-red-500/10
                  transition-all
                "
              >
                <LogOut size={18} />

                <span className="font-medium">
                  Logout
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 max-w-xl mx-auto mt-20 space-y-6">
        {/* Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle2
              size={25}
              className="text-purple-300"
            />

            <span className="text-sm uppercase tracking-[0.25em] text-purple-300">
              Productivity
            </span>
          </div>

          <h1
            className="
              text-4xl
              font-extrabold
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-pink-400
              via-purple-400
              to-blue-400
            "
          >
            ✨ Today’s Smart Todo List
          </h1>

          {user?.email && (
            <p className="mt-3 text-sm text-gray-400">
              Welcome back, {user.email}
            </p>
          )}
        </div>

        {/* ================= ADD TODO ================= */}

        <div
          className="
            bg-[#091725]/80
            backdrop-blur-md
            p-4
            rounded-xl
            border border-white/10
            shadow-lg
          "
        >
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addTodo();
              }
            }}
            placeholder="✨ Add tasks using natural language…"
            className="
              w-full
              bg-transparent
              outline-none
              text-slate-200
              placeholder:text-slate-500
            "
          />

          <button
            type="button"
            onClick={addTodo}
            disabled={createMutation.isPending}
            className="
              mt-3
              px-5
              py-2
              rounded-xl
              bg-gradient-to-r
              from-purple-400
              to-pink-300
              text-black
              font-semibold
              hover:scale-105
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            {createMutation.isPending
              ? "Adding..."
              : "Add Task"}
          </button>

          <Suggestions
            query={text}
            onPick={(title) => setText(title)}
          />
        </div>

        {/* ================= TODO LIST ================= */}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              Loading your tasks...
            </div>
          ) : todos.length === 0 ? (
            <div
              className="
                text-center
                bg-white/5
                backdrop-blur-md
                border border-white/10
                rounded-2xl
                p-8
              "
            >
              <CheckCircle2
                size={40}
                className="mx-auto mb-3 text-purple-300"
              />

              <p className="text-gray-300">
                No tasks yet.
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Add your first task above and get started.
              </p>
            </div>
          ) : (
            todos.map((todo: any) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={(id) =>
                  toggleMutation.mutate(id)
                }
                onDelete={(id) =>
                  deleteMutation.mutate(id)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};