// app/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/Sidebar";

// Reusable card component (same as dashboard)
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 p-6 rounded-xl">
      <h2 className="mb-4 font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-purple-500/30 p-2 rounded text-white text-sm">
        <p>{`${label} : ${payload[0].value}${payload[0].unit || ""}`}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ["#a855f7", "#9333ea", "#7e22ce", "#c084fc", "#b377e0"];

interface Task {
  task_date: string;
  planned_minutes: number;
  actual_minutes: number;
  category: string;
}

export default function AnalyticsPage() {
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);

  // Raw numbers for insight generation
  const [dailyTotals, setDailyTotals] = useState({ planned: 0, actual: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("tasks")
      .select("task_date, planned_minutes, actual_minutes, category")
      .eq("user_id", userData.user.id);

    if (!data) {
      setLoading(false);
      return;
    }

    // DAILY
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = data.filter((t) => t.task_date === today);

    const plannedToday = todayTasks.reduce(
      (sum, t) => sum + (t.planned_minutes || 0),
      0
    );
    const actualToday = todayTasks.reduce(
      (sum, t) => sum + (t.actual_minutes || 0),
      0
    );

    setDailyData([
      { name: "Planned", value: plannedToday },
      { name: "Actual", value: actualToday },
    ]);
    setDailyTotals({ planned: plannedToday, actual: actualToday });

    // WEEKLY (last 7 days)
    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    const weekly = last7
      .map((date) => {
        const tasks = data.filter((t) => t.task_date === date);
        const planned = tasks.reduce(
          (sum, t) => sum + (t.planned_minutes || 0),
          0
        );
        const actual = tasks.reduce(
          (sum, t) => sum + (t.actual_minutes || 0),
          0
        );
        return {
          date,
          productivity: planned === 0 ? 0 : Math.round((actual / planned) * 100),
        };
      })
      .reverse();

    setWeeklyData(weekly);

    // MONTHLY
    const monthlyMap: any = {};

    data.forEach((task) => {
      const month = task.task_date.substring(0, 7);
      if (!monthlyMap[month]) {
        monthlyMap[month] = { planned: 0, actual: 0 };
      }
      monthlyMap[month].planned += task.planned_minutes || 0;
      monthlyMap[month].actual += task.actual_minutes || 0;
    });

    const monthly = Object.keys(monthlyMap).map((month) => ({
      month,
      productivity:
        monthlyMap[month].planned === 0
          ? 0
          : Math.round((monthlyMap[month].actual / monthlyMap[month].planned) * 100),
    }));

    setMonthlyData(monthly);

    // CATEGORY BREAKDOWN (actual time)
    const categoryMap: any = {};

    data.forEach((task) => {
      const cat = task.category || "Other";
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += task.actual_minutes || 0;
    });

    const categoryChart = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }));

    setCategoryData(categoryChart);
    setLoading(false);
  };

  const generateInsights = async () => {
    setInsightLoading(true);
    try {
      const res = await fetch("/api/gemini-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daily: dailyTotals,
          weekly: weeklyData,
          monthly: monthlyData,
          category: categoryData,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsight(data.insight);
    } catch (error) {
      console.error(error);
      setInsight("Sorry, couldn't generate insights right now.");
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-black text-white p-6 mt-16 md:mt-0 flex items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-black text-white p-6 mt-16 md:mt-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <button
            onClick={generateInsights}
            disabled={insightLoading}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition shadow-[0_0_25px_rgba(168,85,247,0.3)] disabled:opacity-50"
          >
            {insightLoading ? "Generating..." : "✨ Generate AI Insights"}
          </button>
        </div>

        {/* Daily Planned vs Actual */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Today: Planned vs Actual (minutes)">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Weekly Productivity */}
          <Card title="Weekly Productivity (%)">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: "#a855f7", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Productivity */}
        <div className="mb-8">
          <Card title="Monthly Productivity (%)">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="productivity" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Category Breakdown and AI Insight */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Time Distribution by Category (minutes)">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData.length ? categoryData : [{ name: "No data", value: 1 }]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label={(entry) => entry.name}
                >
                  {categoryData.length ? (
                    categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))
                  ) : (
                    <Cell fill="#333" />
                  )}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Insight Card */}
          <Card title="AI Insights">
            {insight ? (
              <div className="text-purple-200 text-sm leading-relaxed whitespace-pre-line">
                {insight}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Click the "Generate AI Insights" button above to get personalized suggestions based on your data.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}