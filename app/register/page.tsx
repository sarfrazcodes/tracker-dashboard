"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !phone || !name) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Successful registration
    if (data.session) {
      router.replace("/dashboard");
    } else {
      // If email confirmation is enabled
      alert("Registration successful! Please check your email.");
      router.replace("/login");
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const handleFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-2xl shadow-2xl p-8">

          <div className="flex justify-center mb-6">
            <img src="/weblogo.png" className="w-10 h-10 rounded-lg" />
          </div>

          <h1 className="text-2xl font-semibold text-white text-center">
            Create Account
          </h1>
          <p className="text-gray-400 text-center mt-1 mb-6">
            Join Tracker Dashboard
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full bg-black/40 border border-purple-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full bg-black/40 border border-purple-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Phone</label>
              <input
                type="tel"
                required
                className="mt-1 w-full bg-black/40 border border-purple-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                required
                className="mt-1 w-full bg-black/40 border border-purple-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-purple-500/20" />
            <span className="text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-purple-500/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-2 bg-white/5 border border-purple-500/20 hover:border-purple-500/40 py-2 rounded-lg transition"
            >
              <span className="text-sm text-white">Google</span>
            </button>

            <button
              onClick={handleFacebook}
              className="flex items-center justify-center gap-2 bg-white/5 border border-purple-500/20 hover:border-purple-500/40 py-2 rounded-lg transition"
            >
              <span className="text-sm text-white">Facebook</span>
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
