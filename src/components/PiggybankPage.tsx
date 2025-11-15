import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PiggyBank, Flame, Trophy, Calendar } from "lucide-react";

interface SavingsData {
  total: number;
  streak: number;
  lastSaveDate: string;
  history: { date: string; amount: number }[];
}

export function PiggybankPage() {
  const [savingsData, setSavingsData] = useState<SavingsData>({
    total: 0,
    streak: 0,
    lastSaveDate: "",
    history: [],
  });
  const [todayAmount, setTodayAmount] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("piggybankData");
    if (saved) {
      setSavingsData(JSON.parse(saved));
    }
  }, []);

  const addSavings = () => {
    const amount = parseFloat(todayAmount);
    if (!amount || amount <= 0) return;

    const today = new Date().toISOString().split("T")[0];
    const lastDate = savingsData.lastSaveDate;

    let newStreak = savingsData.streak;

    // Check if this is a new day
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // Increment streak if saved yesterday, reset if missed days
      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastDate === "") {
        newStreak = 1;
      } else {
        newStreak = 1; // Reset streak
      }
    }

    const updated = {
      total: savingsData.total + amount,
      streak: newStreak,
      lastSaveDate: today,
      history: [{ date: today, amount }, ...savingsData.history.slice(0, 29)],
    };

    setSavingsData(updated);
    localStorage.setItem("piggybankData", JSON.stringify(updated));
    setTodayAmount("");
  };

  const fillPercentage = Math.min((savingsData.total / 10000) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Piggybank Savings</h1>
        <p className="text-pink-100">Build your daily saving habit</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Piggybank Visual */}
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Piggy Bank Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <PiggyBank className="w-40 h-40 text-pink-400" />
                  {/* Fill effect */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 to-pink-400 opacity-30 rounded-full transition-all duration-500"
                    style={{ height: `${fillPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <h2 className="text-violet-900 mb-2">
              ₱
              {savingsData.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <p className="text-violet-600">Total Saved</p>
          </div>
        </Card>

        {/* Daily Input & Stats */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-violet-900 mb-4">Add Today's Savings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={todayAmount}
                  onChange={(e) => setTodayAmount(e.target.value)}
                />
              </div>
              <Button
                onClick={addSavings}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Add to Piggybank
              </Button>
            </div>
          </Card>

          {/* Streak Card */}
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-orange-900 mb-1">
                  {savingsData.streak} Day Streak
                </h3>
                <p className="text-orange-600">Keep it going!</p>
              </div>
            </div>
          </Card>

          {/* Rewards Card */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-amber-900 mb-1">
                  {savingsData.streak >= 30
                    ? "🏆 Saving Master!"
                    : savingsData.streak >= 14
                    ? "⭐ Two Weeks!"
                    : savingsData.streak >= 7
                    ? "🎯 One Week!"
                    : "🌱 Getting Started"}
                </h3>
                <p className="text-amber-600">
                  {savingsData.streak < 7
                    ? `${7 - savingsData.streak} days to first milestone`
                    : savingsData.streak < 14
                    ? `${14 - savingsData.streak} days to two weeks`
                    : savingsData.streak < 30
                    ? `${30 - savingsData.streak} days to master`
                    : "Amazing discipline!"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent History */}
      <Card className="p-6">
        <h3 className="text-violet-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {savingsData.history.length === 0 ? (
            <p className="text-violet-400 text-center py-8">
              No savings yet. Start your journey today!
            </p>
          ) : (
            savingsData.history.slice(0, 10).map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-violet-50 rounded-lg"
              >
                <span className="text-violet-600">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-violet-900 dark:text-violet-100">
                  +₱{entry.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
