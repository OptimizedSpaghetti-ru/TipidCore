import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Plus, CreditCard, Calendar, TrendingDown, Edit } from "lucide-react";

interface Debt {
  id: string;
  name: string;
  totalDebt: number;
  paidAmount: number;
  targetDate: string;
  color: string;
}

export function DebtTrackerPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("debts");
    if (saved) {
      setDebts(JSON.parse(saved));
    }
  }, []);

  const addDebt = (name: string, totalDebt: number, targetDate: string) => {
    const colors = [
      "from-red-500 to-rose-600",
      "from-orange-500 to-amber-600",
      "from-yellow-500 to-orange-600",
      "from-blue-500 to-cyan-600",
    ];

    const newDebt: Debt = {
      id: Date.now().toString(),
      name,
      totalDebt,
      paidAmount: 0,
      targetDate,
      color: colors[debts.length % colors.length],
    };

    const updated = [...debts, newDebt];
    setDebts(updated);
    localStorage.setItem("debts", JSON.stringify(updated));
    setIsAddDialogOpen(false);
  };

  const updatePayment = (id: string, paidAmount: number) => {
    const updated = debts.map((debt) =>
      debt.id === id
        ? { ...debt, paidAmount: Math.min(paidAmount, debt.totalDebt) }
        : debt
    );
    setDebts(updated);
    localStorage.setItem("debts", JSON.stringify(updated));
    setEditingDebt(null);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.totalDebt, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);
  const totalRemaining = totalDebt - totalPaid;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Debt Tracker</h1>
        <p className="text-red-100">
          Monitor and manage your debt payoff journey
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-red-600 to-rose-600 border-0">
          <p className="text-red-100 mb-2">Total Debt</p>
          <p className="text-white">₱{totalDebt.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 border-0">
          <p className="text-blue-100 mb-2">Paid Off</p>
          <p className="text-white">₱{totalPaid.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 border-0">
          <p className="text-green-100 mb-2">Remaining</p>
          <p className="text-white">₱{totalRemaining.toFixed(2)}</p>
        </Card>
      </div>

      {/* Add Debt Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const totalDebt = parseFloat(
                  formData.get("totalDebt") as string
                );
                const targetDate = formData.get("targetDate") as string;
                addDebt(name, totalDebt, targetDate);
                e.currentTarget.reset();
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Debt Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Student Loan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalDebt">Total Amount</Label>
                  <Input
                    id="totalDebt"
                    name="totalDebt"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Payoff Date</Label>
                  <Input
                    id="targetDate"
                    name="targetDate"
                    type="date"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Debt
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Debts Grid */}
      {debts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-violet-900 mb-2">No Debts Tracked</h3>
          <p className="text-violet-600 mb-6">
            Start tracking your debt to monitor payoff progress
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {debts.map((debt) => {
            const progress = (debt.paidAmount / debt.totalDebt) * 100;
            const remaining = debt.totalDebt - debt.paidAmount;
            const targetDate = new Date(debt.targetDate);
            const daysRemaining = Math.ceil(
              (targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={debt.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${debt.color} rounded-xl flex items-center justify-center`}
                    >
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-violet-900">{debt.name}</h3>
                      <p className="text-violet-600">
                        ₱{debt.totalDebt.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDebt(debt)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Payment</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const paidAmount = parseFloat(
                            formData.get("paidAmount") as string
                          );
                          updatePayment(debt.id, paidAmount);
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="paidAmount">
                              Total Paid Amount
                            </Label>
                            <Input
                              id="paidAmount"
                              name="paidAmount"
                              type="number"
                              step="0.01"
                              defaultValue={debt.paidAmount}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Update Payment
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Progress value={progress} className="mb-4" />

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-blue-600 mb-1">Paid</p>
                    <p className="text-blue-900">
                      ₱{debt.paidAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-red-600 mb-1">Remaining</p>
                    <p className="text-red-900">₱{remaining.toFixed(2)}</p>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-violet-600 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>Days</span>
                    </div>
                    <p className="text-violet-900">
                      {daysRemaining > 0 ? daysRemaining : "Past due"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-violet-600 bg-violet-50 rounded-lg p-3">
                  <p>Target: {targetDate.toLocaleDateString()}</p>
                  <p className="mt-1">{progress.toFixed(1)}% Complete</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
