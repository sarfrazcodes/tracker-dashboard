// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-700/20 blur-[160px] rounded-full" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="group relative w-10 h-10 flex items-center justify-center cursor-pointer">
  
  {/* glow */}
  <div className="absolute inset-0 bg-purple-600 blur-xl opacity-0 group-hover:opacity-80 transition duration-300 rounded-xl" />

  {/* logo */}
  <img
    src="/weblogo.png"
    alt="logo"
    className="relative w-10 h-10 transition duration-300 group-hover:scale-110"
  />

</div>


            <span className="font-semibold text-lg tracking-wide">
              Tracker Dashboard
            </span>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-lg border border-purple-500/20 hover:border-purple-500 transition"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40 pb-28">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          Track Your Productivity.
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Understand Your Habits.
          </span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl text-lg">
          Tracker Dashboard helps you log daily activities, analyze trends,
          visualize progress, and receive AI-powered insights to improve
          productivity and consistency.
        </p>

        <div className="flex gap-4 mt-10">
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition shadow-[0_0_40px_rgba(168,85,247,0.3)]"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-xl border border-purple-500/20 hover:border-purple-500 transition"
          >
            Login
          </button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-semibold text-center mb-14">
          Why use Tracker Dashboard?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <FeatureCard
            title="Track Daily Activities"
            desc="Log tasks, study time, workouts, or any activity and keep a daily record of your progress."
            icon="/track.png"
          />

          <FeatureCard
            title="Visual Analytics"
            desc="View beautiful charts showing weekly progress, category performance, and productivity trends."
            icon="/analytics.png"
          />

          <FeatureCard
            title="AI Insights"
            desc="Get smart suggestions and insights to improve consistency and maximize your productivity."
            icon="/ai.png"
          />

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-purple-500/10 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Tracker Dashboard. Built for productivity.
      </footer>
    </main>
  );
}

type FeatureCardProps = {
  title: string;
  desc: string;
  icon: string;
};

function FeatureCard({ title, desc, icon }: FeatureCardProps) {
  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/20 to-transparent hover:from-purple-500/60 transition duration-500">
      
      <div className="relative h-full backdrop-blur-xl bg-black/60 border border-purple-500/10 rounded-2xl p-6 transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_60px_rgba(168,85,247,0.35)]">

        {/* ICON */}
        <div className="relative w-14 h-14 mb-5">
          <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-0 group-hover:opacity-70 transition duration-500 rounded-xl" />
          
          <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:border-purple-400">
            <img src={icon} className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          {desc}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>
    </div>
  );
}