import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Target, Calendar, DollarSign, Edit } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  days: number;
  startDate: string;
  dailyAmount: number;
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("savingGoals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const updateGoalProgress = (id: string, amount: number) => {
    const updated = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            currentAmount: Math.min(
              goal.currentAmount + amount,
              goal.targetAmount
            ),
          }
        : goal
    );
    setGoals(updated);
    localStorage.setItem("savingGoals", JSON.stringify(updated));
    setEditingGoal(null);
    setAddAmount("");
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((goal) => goal.id !== id);
    setGoals(updated);
    localStorage.setItem("savingGoals", JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Saving Goals</h1>
          <p className="text-violet-100">Track progress toward your dreams</p>
        </div>
        <Link to="/app/goals/create">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </Link>
      </div>

      {goals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-violet-900 mb-2">No Goals Yet</h3>
          <p className="text-violet-600 mb-6">
            Start by creating your first saving goal
          </p>
          <Link to="/app/goals/create">
            <Button>Create Your First Goal</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysSinceStart = Math.floor(
              (Date.now() - new Date(goal.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const daysRemaining = Math.max(goal.days - daysSinceStart, 0);
            const expectedDate = new Date(
              new Date(goal.startDate).getTime() +
                goal.days * 24 * 60 * 60 * 1000
            );

            return (
              <Card key={goal.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-violet-900">{goal.name}</h3>
                      <p className="text-violet-600 dark:text-violet-300">
                        ₱{goal.currentAmount.toFixed(2)} / ₱
                        {goal.targetAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGoal(goal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Progress</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="add-amount">Add Amount</Label>
                          <Input
                            id="add-amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const amount = parseFloat(addAmount);
                              if (amount > 0) {
                                updateGoalProgress(goal.id, amount);
                              }
                            }}
                            className="flex-1"
                          >
                            Add Amount
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              deleteGoal(goal.id);
                              setEditingGoal(null);
                            }}
                          >
                            Delete Goal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Progress value={progress} className="mb-4" />

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-violet-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-violet-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Daily</span>
                    </div>
                    <p className="text-violet-900">
                      ${goal.dailyAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Days Left</span>
                    </div>
                    <p className="text-purple-900">{daysRemaining}</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-pink-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span>Progress</span>
                    </div>
                    <p className="text-pink-900">{progress.toFixed(0)}%</p>
                  </div>
                </div>

                <div className="text-violet-600 bg-violet-50 rounded-lg p-3">
                  <p>
                    Expected completion: {expectedDate.toLocaleDateString()}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
