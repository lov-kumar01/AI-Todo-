import React, { useState } from "react";
import { CreateTodoInput } from "../schemas/todoSchemas";
import { parseNLTodo } from "../utils/nlParser";

interface ParsedTodo extends CreateTodoInput {
  tags?: string[];
  estimatedMinutes?: number;
  dueDate?: string;
}

interface Props {
  onParsed: (data: ParsedTodo) => void;
}

export const NLInput: React.FC<Props> = ({ onParsed }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const parsed = parseNLTodo(text);
    onParsed(parsed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Try: "Plan slides by tomorrow 5pm tag:work #1h"'
        className="flex-1 border rounded px-3 py-2"
      />

      <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700">
        Add (NL)
      </button>
    </form>
  );
};
