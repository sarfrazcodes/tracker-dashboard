// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="group relative w-10 h-10 flex items-center justify-center">
  
  {/* glow (hidden by default) */}
  <div className="absolute inset-0 bg-purple-600/40 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition duration-300" />
  
  {/* logo container */}
  <div className="backdrop-blur-md bg-white/5 border border-purple-500/30 rounded-xl p-1 transition duration-300 group-hover:border-purple-500">
    <img
      src="/weblogo.png"
      alt="logo"
      className="w-8 h-8 rounded-md"
    />
  </div>

</div>

          <span className="font-semibold text-lg">Tracker Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 rounded-lg border border-purple-500/30 hover:border-purple-500 text-sm"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-sm font-medium"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-28">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Track Your Productivity.
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Understand Your Habits.
          </span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl text-lg">
          Tracker Dashboard helps you log daily activities, analyze trends,
          visualize progress, and receive AI-powered insights to improve your
          productivity and consistency.
        </p>

        <div className="flex gap-4 mt-10">
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 font-medium shadow-lg"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl border border-purple-500/30 hover:border-purple-500 text-gray-200"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-semibold text-center mb-14">
          Why use Tracker Dashboard?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Track Daily Activities"
            desc="Log tasks, study time, workouts, or any activity and keep a daily record of your progress."
          />

          <FeatureCard
            title="Visual Analytics"
            desc="View beautiful charts showing weekly progress, category performance, and productivity trends."
          />

          <FeatureCard
            title="AI Insights"
            desc="Get smart suggestions and insights to improve consistency and maximize your productivity."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/10 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Tracker Dashboard. Built for productivity.
      </footer>
    </main>
  );
}

type FeatureCardProps = {
  title: string;
  desc: string;
};

function FeatureCard({ title, desc }: FeatureCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-400 mt-2 text-sm">{desc}</p>
    </div>
  );
}