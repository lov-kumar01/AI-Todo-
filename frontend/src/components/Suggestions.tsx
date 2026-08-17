import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface SuggestionsProps {
  query: string;
  onPick: (suggestion: string) => void;
}

interface SuggestionsResponse {
  suggestions: string[];
}

export const Suggestions: React.FC<SuggestionsProps> = ({
  query,
  onPick,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cleanedQuery = query.trim();

    // No query = no suggestions.
    if (!cleanedQuery) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    // Wait until the user stops typing.
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);

        const response = await axiosClient.post<SuggestionsResponse>(
          "/ai/suggestions",
          {
            query: cleanedQuery,
          }
        );

        setSuggestions(response.data.suggestions ?? []);
      } catch (error) {
        console.error("AI suggestions error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  if (!query.trim()) {
    return null;
  }

  return (
    <div className="absolute left-full top-0 ml-4 w-[280px] max-w-[320px]">
      <div
        className="
          rounded-2xl
          border border-white/15
          bg-slate-950/75
          backdrop-blur-xl
          shadow-2xl
          shadow-purple-900/20
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="text-lg">✨</span>

          <div>
            <p className="text-sm font-semibold text-white">
              AI Suggestions
            </p>

            <p className="text-[11px] text-slate-400">
              Related to your topic
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

              <span>Finding related topics...</span>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {!loading && suggestions.length > 0 && (
          <div className="max-h-[360px] overflow-y-auto p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                type="button"
                onClick={() => onPick(suggestion)}
                className="
                  group
                  flex
                  w-full
                  items-center
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  text-slate-200
                  transition-all
                  duration-200
                  hover:bg-purple-500/15
                  hover:text-white
                "
              >
                <span
                  className="
                    mr-3
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/5
                    text-xs
                    text-purple-300
                    transition
                    group-hover:bg-purple-500/20
                  "
                >
                  {index + 1}
                </span>

                <span className="leading-5">
                  {suggestion}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && suggestions.length === 0 && (
          <div className="px-4 py-4">
            <p className="text-sm text-slate-400">
              No related suggestions found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};