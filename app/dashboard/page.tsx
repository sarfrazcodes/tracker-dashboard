// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Task {
  id: string;
  title: string;
  planned_minutes: number;
  actual_minutes: number;
  is_completed: boolean;
  task_date: string;
  category: string;
  priority: string;
  notes: string;
  created_at: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [planned, setPlanned] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch tasks for the last 7 days
  useEffect(() => {
    fetchWeekTasks();
  }, []);

  const fetchWeekTasks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    // Get date range: today and previous 6 days
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const startDate = weekAgo.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userData.user.id)
      .gte("task_date", startDate)
      .lte("task_date", endDate)
      .order("task_date", { ascending: false });

    setTasks(data || []);
    setLoading(false);
  };

  const addTask = async () => {
    if (!title || !planned) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from("tasks").insert({
      user_id: userData.user.id,
      title,
      planned_minutes: Number(planned),
      category: category || "Other",
      priority,
      notes,
      task_date: date,
    });

    // Reset form and close modal
    setTitle("");
    setPlanned("");
    setCategory("");
    setPriority("Medium");
    setNotes("");
    setDate(new Date().toISOString().split("T")[0]);
    setModalOpen(false);

    fetchWeekTasks();
  };

  const toggleTask = async (task: Task) => {
    if (!task.is_completed) {
      const actual = prompt("How many minutes did you actually spend?");
      if (!actual) return;

      await supabase
        .from("tasks")
        .update({
          is_completed: true,
          actual_minutes: Number(actual),
        })
        .eq("id", task.id);
    } else {
      await supabase
        .from("tasks")
        .update({
          is_completed: false,
          actual_minutes: 0,
        })
        .eq("id", task.id);
    }

    fetchWeekTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------- Computed stats ----------
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => t.task_date === todayStr);
  const completedToday = todayTasks.filter((t) => t.is_completed).length;

  // Total actual hours today (convert minutes to hours)
  const todayActualMinutes = todayTasks
    .filter((t) => t.is_completed)
    .reduce((sum, t) => sum + (t.actual_minutes || 0), 0);
  const todayHours = (todayActualMinutes / 60).toFixed(1) + "h";

  // Tasks done today (count of completed tasks)
  const tasksDone = completedToday;

  // Streak: consecutive days with at least one completed task (simple version)
  const streak = (() => {
    const completedDates = new Set(
      tasks.filter((t) => t.is_completed).map((t) => t.task_date)
    );
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      if (completedDates.has(dateStr)) count++;
      else break;
    }
    return count;
  })();

  // Weekly average hours per day (based on actual minutes)
  const weeklyAvg = (() => {
    const dayMap = new Map();
    tasks.forEach((t) => {
      if (t.is_completed) {
        const prev = dayMap.get(t.task_date) || 0;
        dayMap.set(t.task_date, prev + (t.actual_minutes || 0));
      }
    });
    const totalMinutes = Array.from(dayMap.values()).reduce(
      (sum, m) => sum + m,
      0
    );
    const avgMinutes = totalMinutes / 7; // over last 7 days
    return (avgMinutes / 60).toFixed(1) + "h";
  })();

  // Chart data: last 7 days (Mon-Sun) hours
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayTasks = tasks.filter(
      (t) => t.task_date === dateStr && t.is_completed
    );
    const totalMinutes = dayTasks.reduce(
      (sum, t) => sum + (t.actual_minutes || 0),
      0
    );
    return { day: dayName, hours: totalMinutes / 60 };
  });

  const lineData = last7Days;
  const barData = last7Days;

  // Pie data: category totals for the week
  const categoryTotals = new Map<string, number>();
  tasks
    .filter((t) => t.is_completed)
    .forEach((t) => {
      const cat = t.category || "Other";
      const prev = categoryTotals.get(cat) || 0;
      categoryTotals.set(cat, prev + (t.actual_minutes || 0));
    });
  const pieData = Array.from(categoryTotals.entries()).map(([name, value]) => ({
    name,
    value,
  }));
  const COLORS = ["#a855f7", "#9333ea", "#7e22ce", "#c084fc", "#b377e0"];

  // Productivity score (0-100) based on today's completion rate
  const productivity =
    todayTasks.length === 0
      ? 0
      : Math.round((completedToday / todayTasks.length) * 100);

  // Goal progress (daily goal 6 hours)
  const goalProgress = Math.min(
    100,
    Math.round((todayActualMinutes / (6 * 60)) * 100)
  );

  // Recent entries (last 5 tasks overall)
  const recentTasks = [...tasks]
    .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    .slice(0, 5);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-black text-white p-6 mt-16 md:mt-0">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition shadow-[0_0_25px_rgba(168,85,247,0.3)]"
          >
            + Add Entry
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Today Hours" value={todayHours} />
          <StatCard title="Tasks Done" value={tasksDone.toString()} />
          <StatCard title="Streak" value={`🔥 ${streak} days`} />
          <StatCard title="Weekly Avg" value={weeklyAvg} />
        </div>

        {/* CHARTS ROW */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* LINE CHART */}
          <Card title="Daily Progress">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#a855f7"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* PIE CHART */}
          <Card title="Category Split">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData.length ? pieData : [{ name: "No data", value: 1 }]}
                  dataKey="value"
                  outerRadius={80}
                >
                  {pieData.length ? (
                    pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))
                  ) : (
                    <Cell fill="#333" />
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* AI INSIGHT */}
          <Card title="AI Insight">
            <div className="text-purple-300 text-sm leading-relaxed">
              You are <b>18% more productive</b> than last week.
              <br />
              Most productive time: <b>9 AM – 11 AM</b>.
            </div>
          </Card>
        </div>

        {/* BAR CHART */}
        <div className="mb-8">
          <Card title="Weekly Comparison">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="day" stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="hours" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* GOAL + STREAK */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Goal Progress">
            <div className="text-sm mb-2">Daily goal: 6h</div>
            <div className="w-full h-3 bg-white/10 rounded-full">
              <div
                className="h-3 bg-purple-600 rounded-full"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </Card>

          <Card title="Productivity Score">
            <div className="text-4xl font-bold text-purple-400">
              {productivity}
            </div>
            <div className="text-sm text-gray-400">Keep going 🔥</div>
          </Card>
        </div>

        {/* RECENT ENTRIES */}
        <Card title="Recent Entries">
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left py-2">Activity</th>
                <th>Category</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
                <Row
                  key={task.id}
                  a={task.title}
                  c={task.category || "—"}
                  t={
                    task.is_completed
                      ? `${task.actual_minutes} min`
                      : `${task.planned_minutes} min (planned)`
                  }
                  d={task.task_date}
                />
              ))}
              {recentTasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No recent entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* ADD TASK MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">New Task</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-purple-500/20 rounded p-2 text-white"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border border-purple-500/20 rounded p-2 text-white"
                >
                  <option value="">Category</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-black border border-purple-500/20 rounded p-2 text-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black border border-purple-500/20 rounded p-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Planned minutes"
                  value={planned}
                  onChange={(e) => setPlanned(e.target.value)}
                  className="w-full bg-black border border-purple-500/20 rounded p-2 text-white"
                />
                <textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black border border-purple-500/20 rounded p-2 text-white"
                  rows={3}
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={addTask}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable components (unchanged from first version)
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 p-5 rounded-xl">
      <div className="text-gray-400 text-sm">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 p-6 rounded-xl">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Row({ a, c, t, d }: { a: string; c: string; t: string; d: string }) {
  return (
    <tr className="border-t border-white/10">
      <td className="py-2">{a}</td>
      <td className="text-center">{c}</td>
      <td className="text-center">{t}</td>
      <td className="text-center">{d}</td>
    </tr>
  );
}