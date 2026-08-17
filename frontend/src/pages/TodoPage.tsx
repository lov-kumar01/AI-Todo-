import React, { useState } from "react";
import {
  User,
  LogOut,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoItem } from "../components/TodoItem";
import { parseNLTodo } from "../utils/nlParser";
import axiosClient from "../api/axiosClient";
import { DailyInspiration } from "../components/DailyInspiration";
import { Suggestions } from "../components/Suggestions";
import BalloonBackground from "@/components/ui/BalloonBackground";

export const TodoPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos = [] } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axiosClient.get("/todos");
      return response.data;
    },
  });

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();

    queryClient.clear();

    setProfileOpen(false);

    window.location.href = "/";
  };

  /* ==============================
     Task Input
  ============================== */

  const [text, setText] = useState("");

  /* ==============================
     Create Todo
  ============================== */

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

  /* ==============================
     Toggle Todo
  ============================== */

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

  /* ==============================
     Delete Todo
  ============================== */

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(
        `/todos/${id}`
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  /* ==============================
     Add Todo
  ============================== */

  const addTodo = () => {
    const cleanedText = text.trim();

    if (!cleanedText) {
      return;
    }

    const parsed = parseNLTodo(cleanedText);

    createMutation.mutate(parsed);

    setText("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* =====================================
          Animated Background
      ===================================== */}

      <BalloonBackground />{/* User Profile */}
<div className="absolute right-5 top-5 z-50">
  <button
    type="button"
    onClick={() => setProfileOpen((open) => !open)}
    className="
      flex
      items-center
      gap-2
      rounded-full
      border
      border-white/15
      bg-white/10
      px-3
      py-2
      text-white
      shadow-lg
      backdrop-blur-xl
      transition-all
      duration-200
      hover:bg-white/15
    "
  >
    <div
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        bg-gradient-to-br
        from-purple-400
        to-pink-400
        text-black
      "
    >
      <User size={18} />
    </div>

    <ChevronDown
      size={16}
      className={`
        transition-transform
        duration-200
        ${profileOpen ? "rotate-180" : ""}
      `}
    />
  </button>

  {/* Profile Dropdown */}
  {profileOpen && (
    <div
      className="
        absolute
        right-0
        top-14
        w-64
        overflow-hidden
        rounded-2xl
        border
        border-white/15
        bg-slate-950/85
        shadow-2xl
        backdrop-blur-2xl
      "
    >
      {/* User information */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-purple-400
              to-pink-400
              text-black
            "
          >
            <User size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              Welcome
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {user?.email || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="
          flex
          w-full
          items-center
          gap-3
          px-4
          py-3
          text-left
          text-sm
          font-medium
          text-slate-200
          transition
          hover:bg-red-500/10
          hover:text-red-300
        "
      >
        <LogOut size={18} />

        <span>Logout</span>
      </button>
    </div>
  )}
</div>


      {/* =====================================
          Main Page
      ===================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-6
          pb-16
          pt-12
        "
      >
        {/* ===================================
            DAILY INSPIRATION
        =================================== */}

        <DailyInspiration />

        {/* ===================================
            PAGE HEADING
        =================================== */}

        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="mb-3 text-sm font-semibold tracking-[0.3em] text-purple-300">
            ✦ PRODUCTIVITY
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
              sm:text-5xl
            "
          >
            ✨ Today’s Smart Todo List
          </h1>

          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Turn your ideas into focused, achievable tasks.
          </p>
        </div>

        {/* ===================================
            TASK INPUT + AI SUGGESTIONS
        =================================== */}

        <div className="relative mx-auto max-w-3xl">
          {/* Task Input Card */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-[#091725]/85
              p-4
              shadow-2xl
              backdrop-blur-xl
            "
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
              placeholder="✨ Add tasks using natural language…"
              className="
                w-full
                bg-transparent
                text-base
                text-slate-200
                outline-none
                placeholder:text-slate-500
              "
            />

            <button
              type="button"
              onClick={addTodo}
              disabled={
                !text.trim() ||
                createMutation.isPending
              }
              className="
                mt-3
                rounded-lg
                bg-gradient-to-r
                from-purple-400
                to-pink-300
                px-5
                py-2.5
                font-semibold
                text-black
                transition
                hover:scale-[1.02]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {createMutation.isPending
                ? "Adding..."
                : "Add Task"}
            </button>
          </div>

          {/* =================================
              AI SUGGESTIONS
              Appears to the right
          ================================= */}

          <Suggestions
            query={text}
            onPick={(suggestion) => {
              setText(suggestion);
            }}
          />
        </div>

        {/* ===================================
            TODO LIST
        =================================== */}

        <div className="mx-auto mt-8 max-w-3xl">
          {todos.length > 0 ? (
            <div className="space-y-4">
              {todos.map((todo: any) => (
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
              ))}
            </div>
          ) : (
            /* =================================
               EMPTY STATE
            ================================= */

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.035]
                px-6
                py-12
                text-center
                shadow-xl
                backdrop-blur-xl
              "
            >
              {/* Soft glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-40
                  w-40
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-purple-500/20
                  blur-3xl
                "
              />

              <div className="relative z-10">
                {/* Check circle */}

                <div
                  className="
                    mx-auto
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-purple-400/60
                    bg-purple-400/10
                    text-3xl
                    shadow-lg
                    shadow-purple-500/10
                  "
                >
                  ✓
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-200
                  "
                >
                  No tasks yet
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Add your first task above and start
                  turning your plans into progress.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};