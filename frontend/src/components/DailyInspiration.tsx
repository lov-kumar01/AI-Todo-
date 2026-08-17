import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote as QuoteIcon, Sparkles } from "lucide-react";
import axiosClient from "../api/axiosClient";

interface QuoteResponse {
  quote: string;
  author: string;
}

export const DailyInspiration: React.FC = () => {
  const { data, isLoading, isError } = useQuery<QuoteResponse>({
    queryKey: ["daily-inspiration"],

    queryFn: async () => {
      const response = await axiosClient.get<QuoteResponse>(
        "/quote"
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 30,
  });

  /* ==============================
     Loading
  ============================== */

  if (isLoading) {
    return (
      <section className="mb-7 px-2">
        <div
          className="
            mx-auto
            w-full
            max-w-2xl
            animate-pulse
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            px-4
            py-4
            backdrop-blur-xl
            sm:px-6
          "
        >
          <div className="h-3 w-28 rounded bg-white/10" />

          <div className="mt-4 h-4 w-full rounded bg-white/10" />

          <div className="mt-2 h-4 w-4/5 rounded bg-white/10" />

          <div className="mt-4 h-3 w-24 rounded bg-white/10" />
        </div>
      </section>
    );
  }

  /* ==============================
     Error
  ============================== */

  if (isError || !data) {
    return null;
  }

  return (
    <section className="mb-7 px-2">
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-2xl
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-white/[0.045]
          px-4
          py-4
          shadow-xl
          backdrop-blur-xl
          sm:px-6
          sm:py-5
        "
      >
        {/* =================================
            Background Glow
        ================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -left-16
            -top-16
            h-32
            w-32
            rounded-full
            bg-purple-500/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            -right-16
            h-32
            w-32
            rounded-full
            bg-pink-500/10
            blur-3xl
          "
        />

        {/* =================================
            Header
        ================================= */}

        <div className="relative z-10 mb-3 flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-purple-300/20
              bg-purple-400/10
            "
          >
            <Sparkles
              size={14}
              className="text-purple-300"
            />
          </div>

          <p
            className="
              text-[9px]
              font-bold
              tracking-[0.22em]
              text-purple-300
              sm:text-[10px]
              sm:tracking-[0.28em]
            "
          >
            DAILY INSPIRATION
          </p>
        </div>

        {/* =================================
            Quote
        ================================= */}

        <div className="relative z-10 flex items-start gap-2.5 sm:gap-3">
          <QuoteIcon
            size={22}
            strokeWidth={1.5}
            className="
              mt-0.5
              shrink-0
              text-purple-300/60
              sm:h-6
              sm:w-6
            "
          />

          <div className="min-w-0">
            <blockquote
              className="
                break-words
                text-sm
                font-medium
                leading-6
                text-slate-100
                sm:text-base
                sm:leading-7
              "
            >
              “{data.quote}”
            </blockquote>

            {/* Author */}

            <div className="mt-2.5 flex items-center gap-2">
              <div
                className="
                  h-px
                  w-5
                  shrink-0
                  bg-gradient-to-r
                  from-purple-400
                  to-pink-400
                "
              />

              <p
                className="
                  truncate
                  text-xs
                  font-semibold
                  text-purple-200
                "
              >
                — {data.author}
              </p>
            </div>
          </div>
        </div>

        {/* =================================
            Attribution
        ================================= */}

        <div className="relative z-10 mt-2.5 text-right">
          <a
            href="https://zenquotes.io/"
            target="_blank"
            rel="noreferrer"
            className="
              text-[8px]
              text-slate-600
              transition
              hover:text-slate-400
            "
          >
            ZenQuotes
          </a>
        </div>
      </div>
    </section>
  );
};