import { Link } from "react-router-dom";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Boxes } from "@/components/ui/background-boxes";

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-slate-950">

      <Boxes />
      <div className="absolute inset-0 w-full h-full bg-slate-950 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Main Content */}
      <h1 className="text-5xl md:text-6xl font-extrabold premium-heading mb-6 leading-tight drop-shadow-[0_0_25px_rgba(255,0,200,0.3)] relative z-20">
        ✨ Welcome to <span className="text-white">Today’s</span>  
        <br />  
        <span className="premium-heading">Ultimate To-Do List</span>  
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 relative z-20">
        Stay organized, track your progress, get smart AI suggestions,  
        and make every day more productive 💫  
      </p>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 relative z-20">
        <Link
          to="/login"
          className="px-8 py-3 rounded-xl btn-glow flex items-center justify-center gap-2 text-lg shadow-lg"
        >
          <Sparkles size={20} /> Get Started
        </Link>

        <Link
          to="/register"
          className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg hover:scale-105 transition flex items-center gap-2"
        >
          Create Account <ArrowRight size={20} />
        </Link>
      </div>

      {/* Feature List */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-gray-300 relative z-20">
        
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:scale-105 transition shadow-lg">
          <CheckCircle className="mx-auto text-purple-300 mb-3" size={40} />
          <h3 className="text-xl font-semibold text-white">Smart Task Manager</h3>
          <p className="text-m mt-2">Add tasks, track progress and toggle completion easily.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:scale-105 transition shadow-lg">
          <Sparkles className="mx-auto text-fuchsia-300 mb-3" size={40} />
          <h3 className="text-xl font-semibold text-white">AI Suggestions</h3>
          <p className="text-m mt-2">Get personalized task ideas based on your activity.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:scale-105 transition shadow-lg">
          <CheckCircle className="mx-auto text-pink-300 mb-3" size={40} />
          <h3 className="text-xl font-semibold text-white">Track Time & Habits</h3>
          <p className="text-m mt-2">Use smart timers to boost productivity daily.</p>
        </div>

      </div>
    </div>
  );
};
