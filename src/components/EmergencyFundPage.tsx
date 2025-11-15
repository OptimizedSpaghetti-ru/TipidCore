import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Shield, TrendingUp, Target, DollarSign } from "lucide-react";

interface EmergencyFund {
  targetAmount: number;
  currentAmount: number;
  monthlyExpenses: number;
}

export function EmergencyFundPage() {
  const [fund, setFund] = useState<EmergencyFund>({
    targetAmount: 10000,
    currentAmount: 0,
    monthlyExpenses: 2000,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("emergencyFund");
    if (saved) {
      setFund(JSON.parse(saved));
    }
  }, []);

  const updateFund = (updates: Partial<EmergencyFund>) => {
    const updated = { ...fund, ...updates };
    setFund(updated);
    localStorage.setItem("emergencyFund", JSON.stringify(updated));
    setIsEditing(false);
  };

  const progress = (fund.currentAmount / fund.targetAmount) * 100;
  const monthsCovered =
    fund.monthlyExpenses > 0 ? fund.currentAmount / fund.monthlyExpenses : 0;
  const remaining = fund.targetAmount - fund.currentAmount;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Emergency Fund</h1>
        <p className="text-green-100">Build your financial safety net</p>
      </div>

      {/* Main Progress Card */}
      <Card className="mb-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Circular Progress */}
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(progress / 100) * 553} 553`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Shield className="w-12 h-12 text-green-600 mb-2" />
              <p className="text-green-900">{progress.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-green-900 mb-4">
            ₱
            {fund.currentAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            {" / "}₱
            {fund.targetAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-green-600">
            {monthsCovered.toFixed(1)} months of expenses covered
          </p>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Update Fund
          </Button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const currentAmount = parseFloat(
                formData.get("currentAmount") as string
              );
              updateFund({ currentAmount });
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="currentAmount">Current Amount</Label>
              <Input
                id="currentAmount"
                name="currentAmount"
                type="number"
                step="0.01"
                defaultValue={fund.currentAmount}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-violet-600">Target Goal</p>
              <p className="text-violet-900">
                ₱{fund.targetAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-violet-600">Remaining</p>
              <p className="text-violet-900">₱{remaining.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-violet-600">Monthly Expenses</p>
              <p className="text-violet-900">
                ₱{fund.monthlyExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Card */}
      <Card className="p-6">
        <h3 className="text-violet-900 mb-4">Fund Settings</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const targetAmount = parseFloat(
              formData.get("targetAmount") as string
            );
            const monthlyExpenses = parseFloat(
              formData.get("monthlyExpenses") as string
            );
            updateFund({ targetAmount, monthlyExpenses });
          }}
          className="space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                step="0.01"
                defaultValue={fund.targetAmount}
                required
              />
            </div>
            <div>
              <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
              <Input
                id="monthlyExpenses"
                name="monthlyExpenses"
                type="number"
                step="0.01"
                defaultValue={fund.monthlyExpenses}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Update Settings
          </Button>
        </form>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="text-blue-900 mb-2">💡 Why an Emergency Fund?</h3>
        <p className="text-blue-700 mb-2">
          Financial experts recommend saving 3-6 months of expenses for
          unexpected situations like:
        </p>
        <ul className="text-blue-700 space-y-1 ml-4">
          <li>• Job loss or income reduction</li>
          <li>• Medical emergencies</li>
          <li>• Major home or car repairs</li>
          <li>• Unexpected travel needs</li>
        </ul>
      </Card>
    </div>
  );
}
