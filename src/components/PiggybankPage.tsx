import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  PiggyBank,
  Flame,
  Trophy,
  Calendar,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

interface Piggybank {
  id: string;
  name: string;
  total: number;
  streak: number;
  lastSaveDate: string;
  history: { date: string; amount: number }[];
  color: string;
  icon: string;
}

const iconMap = {
  PiggyBank,
  Trophy,
  Flame,
};

export function PiggybankPage() {
  const [piggybanks, setPiggybanks] = useState<Piggybank[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPiggybank, setEditingPiggybank] = useState<Piggybank | null>(
    null
  );
  const [deletePiggybankId, setDeletePiggybankId] = useState<string | null>(
    null
  );
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [todayAmount, setTodayAmount] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("piggybanks");
    if (saved) {
      setPiggybanks(JSON.parse(saved));
    } else {
      const defaultPiggybanks: Piggybank[] = [
        {
          id: "1",
          name: "Daily Savings",
          total: 0,
          streak: 0,
          lastSaveDate: "",
          history: [],
          color: "from-pink-500 to-rose-600",
          icon: "PiggyBank",
        },
      ];
      setPiggybanks(defaultPiggybanks);
      localStorage.setItem("piggybanks", JSON.stringify(defaultPiggybanks));
    }
  }, []);

  const addPiggybank = (name: string, icon: string) => {
    const colors = [
      "from-pink-500 to-rose-600",
      "from-purple-500 to-violet-600",
      "from-blue-500 to-cyan-600",
      "from-green-500 to-emerald-600",
      "from-yellow-500 to-amber-600",
      "from-orange-500 to-red-600",
    ];

    const newPiggybank: Piggybank = {
      id: Date.now().toString(),
      name,
      total: 0,
      streak: 0,
      lastSaveDate: "",
      history: [],
      color: colors[piggybanks.length % colors.length],
      icon,
    };

    const updated = [...piggybanks, newPiggybank];
    setPiggybanks(updated);
    localStorage.setItem("piggybanks", JSON.stringify(updated));
    setIsAddDialogOpen(false);
  };

  const updatePiggybank = (id: string, name: string, icon: string) => {
    const updated = piggybanks.map((pb) =>
      pb.id === id ? { ...pb, name, icon } : pb
    );
    setPiggybanks(updated);
    localStorage.setItem("piggybanks", JSON.stringify(updated));
    setEditingPiggybank(null);
  };

  const deletePiggybank = (id: string) => {
    const updated = piggybanks.filter((pb) => pb.id !== id);
    setPiggybanks(updated);
    localStorage.setItem("piggybanks", JSON.stringify(updated));
    setDeletePiggybankId(null);
  };

  const addSavings = (id: string) => {
    const amount = parseFloat(todayAmount);
    if (!amount || amount <= 0) return;

    const today = new Date().toISOString().split("T")[0];

    const updated = piggybanks.map((pb) => {
      if (pb.id !== id) return pb;

      const lastDate = pb.lastSaveDate;
      let newStreak = pb.streak;

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

      return {
        ...pb,
        total: pb.total + amount,
        streak: newStreak,
        lastSaveDate: today,
        history: [{ date: today, amount }, ...pb.history.slice(0, 29)],
      };
    });

    setPiggybanks(updated);
    localStorage.setItem("piggybanks", JSON.stringify(updated));
    setTodayAmount("");
    setAddingToId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Piggybank Savings</h1>
        <p className="text-pink-100">Build your daily saving habit</p>
      </div>

      {/* Add Piggybank Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Piggybank
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-bold">
                Add New Piggybank
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const icon = formData.get("icon") as string;
                addPiggybank(name, icon);
                e.currentTarget.reset();
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-800 font-medium">
                    Piggybank Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Vacation Fund"
                    className="bg-white text-gray-900 border-gray-300"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon" className="text-gray-800 font-medium">
                    Icon
                  </Label>
                  <Select name="icon" defaultValue="PiggyBank">
                    <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 shadow-lg">
                      <SelectItem
                        value="PiggyBank"
                        className="text-gray-900 hover:bg-pink-50 cursor-pointer"
                      >
                        🐷 Piggy Bank
                      </SelectItem>
                      <SelectItem
                        value="Trophy"
                        className="text-gray-900 hover:bg-yellow-50 cursor-pointer"
                      >
                        🏆 Trophy
                      </SelectItem>
                      <SelectItem
                        value="Flame"
                        className="text-gray-900 hover:bg-orange-50 cursor-pointer"
                      >
                        🔥 Flame
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold shadow-md"
                >
                  Add Piggybank
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Piggybanks Grid */}
      {piggybanks.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-lg">
          <PiggyBank className="w-20 h-20 text-pink-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Piggybanks Yet
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Create your first piggybank to start saving!
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Piggybank
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {piggybanks.map((piggybank) => {
            const Icon =
              iconMap[piggybank.icon as keyof typeof iconMap] || PiggyBank;
            const fillPercentage = Math.min(
              (piggybank.total / 10000) * 100,
              100
            );

            return (
              <Card
                key={piggybank.id}
                className="p-6 bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${piggybank.color} rounded-xl flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg">
                        {piggybank.name}
                      </h3>
                      <p className="text-gray-600 font-semibold">
                        ₱
                        {piggybank.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingPiggybank?.id === piggybank.id}
                      onOpenChange={(open) =>
                        !open && setEditingPiggybank(null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50"
                          onClick={() => setEditingPiggybank(piggybank)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 font-bold">
                            Edit Piggybank
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = formData.get("name") as string;
                            const icon = formData.get("icon") as string;
                            updatePiggybank(piggybank.id, name, icon);
                          }}
                        >
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="name"
                                className="text-gray-800 font-medium"
                              >
                                Piggybank Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                defaultValue={piggybank.name}
                                className="bg-white text-gray-900 border-gray-300"
                                required
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="icon"
                                className="text-gray-800 font-medium"
                              >
                                Icon
                              </Label>
                              <Select name="icon" defaultValue={piggybank.icon}>
                                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-300 shadow-lg">
                                  <SelectItem
                                    value="PiggyBank"
                                    className="text-gray-900 hover:bg-pink-50 cursor-pointer"
                                  >
                                    🐷 Piggy Bank
                                  </SelectItem>
                                  <SelectItem
                                    value="Trophy"
                                    className="text-gray-900 hover:bg-yellow-50 cursor-pointer"
                                  >
                                    🏆 Trophy
                                  </SelectItem>
                                  <SelectItem
                                    value="Flame"
                                    className="text-gray-900 hover:bg-orange-50 cursor-pointer"
                                  >
                                    🔥 Flame
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold shadow-md"
                            >
                              Update Piggybank
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50"
                      onClick={() => setDeletePiggybankId(piggybank.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Piggybank Visual */}
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <Icon className="w-28 h-28 text-pink-400" />
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 to-pink-400 opacity-30 rounded-full transition-all duration-500"
                          style={{ height: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-medium text-sm">
                        Streak
                      </span>
                    </div>
                    <p className="text-orange-900 font-bold text-lg">
                      {piggybank.streak} days
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-700 font-medium text-sm">
                        Status
                      </span>
                    </div>
                    <p className="text-yellow-900 font-bold">
                      {piggybank.streak >= 30
                        ? "Master"
                        : piggybank.streak >= 14
                        ? "2 Weeks"
                        : piggybank.streak >= 7
                        ? "1 Week"
                        : "Starting"}
                    </p>
                  </div>
                </div>

                {/* Add Savings */}
                <Dialog
                  open={addingToId === piggybank.id}
                  onOpenChange={(open) => !open && setAddingToId(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold shadow-md"
                      onClick={() => setAddingToId(piggybank.id)}
                    >
                      Add Savings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 font-bold">
                        Add to {piggybank.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="amount"
                          className="text-gray-800 font-medium"
                        >
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={todayAmount}
                          onChange={(e) => setTodayAmount(e.target.value)}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                      <Button
                        onClick={() => addSavings(piggybank.id)}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold shadow-md"
                      >
                        Add to Piggybank
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Recent History */}
                {piggybank.history.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-gray-800 font-semibold mb-2 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-violet-600" />
                      Recent Activity
                    </h4>
                    <div className="space-y-2">
                      {piggybank.history.slice(0, 3).map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100 text-sm"
                        >
                          <span className="text-violet-700 font-medium">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <span className="text-violet-900 font-bold">
                            +₱{entry.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletePiggybankId !== null}
        onOpenChange={() => setDeletePiggybankId(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 font-bold">
              Delete Piggybank?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete this
              piggybank and all its savings history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletePiggybankId && deletePiggybank(deletePiggybankId)
              }
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
