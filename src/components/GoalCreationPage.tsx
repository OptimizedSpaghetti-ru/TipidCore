import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Calculator } from "lucide-react";

export function GoalCreationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    days: "",
  });

  const targetAmount = parseFloat(formData.targetAmount) || 0;
  const days = parseInt(formData.days) || 0;
  const dailyAmount = days > 0 ? targetAmount / days : 0;
  const expectedDate =
    days > 0 ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount,
      currentAmount: 0,
      days,
      startDate: new Date().toISOString(),
      dailyAmount,
    };

    const saved = localStorage.getItem("savingGoals");
    const goals = saved ? JSON.parse(saved) : [];
    goals.push(goal);
    localStorage.setItem("savingGoals", JSON.stringify(goals));

    navigate("/app/goals");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/app/goals")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Goals
      </Button>

      <div className="mb-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Create New Goal</h1>
        <p className="text-violet-100">
          Set your target and we'll calculate the rest
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., iPhone 17, Vacation, New Laptop"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="target">Target Amount</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="e.g., 90"
                value={formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              Create Goal
            </Button>
          </form>
        </Card>

        {/* Calculations Preview */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-violet-900">Calculations</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-violet-600 mb-1">Required Daily Savings</p>
                <p className="text-violet-900">
                  ₱{dailyAmount.toFixed(2)} per day
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-violet-600 mb-1">Expected Completion Date</p>
                <p className="text-violet-900">
                  {expectedDate
                    ? expectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Enter days to calculate"}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-violet-600 mb-1">Total Target</p>
                <p className="text-violet-900">${targetAmount.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-blue-700">
              Start with realistic daily amounts. It's better to exceed your
              goal than to fall short!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
