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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  ShoppingCart,
  Car,
  Coffee,
  Film,
  Heart,
  Edit,
  Trash2,
  Home,
  Utensils,
  Plane,
} from "lucide-react";
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

interface Envelope {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

const iconMap = {
  ShoppingCart,
  Car,
  Coffee,
  Film,
  Heart,
  Home,
  Utensils,
  Plane,
};

export function EnvelopeBudgetingPage() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | null>(null);
  const [deleteEnvelopeId, setDeleteEnvelopeId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("envelopes");
    if (saved) {
      setEnvelopes(JSON.parse(saved));
    } else {
      const defaultEnvelopes: Envelope[] = [
        {
          id: "1",
          name: "Groceries",
          allocated: 0,
          spent: 0,
          icon: "ShoppingCart",
          color: "from-green-500 to-emerald-600",
        },
        {
          id: "2",
          name: "Transportation",
          allocated: 0,
          spent: 0,
          icon: "Car",
          color: "from-blue-500 to-cyan-600",
        },
        {
          id: "3",
          name: "Dining Out",
          allocated: 0,
          spent: 0,
          icon: "Coffee",
          color: "from-orange-500 to-amber-600",
        },
        {
          id: "4",
          name: "Entertainment",
          allocated: 0,
          spent: 0,
          icon: "Film",
          color: "from-purple-500 to-violet-600",
        },
      ];
      setEnvelopes(defaultEnvelopes);
      localStorage.setItem("envelopes", JSON.stringify(defaultEnvelopes));
    }
  }, []);

  const addEnvelope = (name: string, allocated: number, icon: string) => {
    const colors = [
      "from-green-500 to-emerald-600",
      "from-blue-500 to-cyan-600",
      "from-orange-500 to-amber-600",
      "from-purple-500 to-violet-600",
      "from-pink-500 to-rose-600",
    ];

    const newEnvelope: Envelope = {
      id: Date.now().toString(),
      name,
      allocated,
      spent: 0,
      icon,
      color: colors[envelopes.length % colors.length],
    };

    const updated = [...envelopes, newEnvelope];
    setEnvelopes(updated);
    localStorage.setItem("envelopes", JSON.stringify(updated));
    setIsAddDialogOpen(false);
  };

  const updateEnvelope = (
    id: string,
    name: string,
    allocated: number,
    spent: number,
    icon: string
  ) => {
    const updated = envelopes.map((env) =>
      env.id === id ? { ...env, name, allocated, spent, icon } : env
    );
    setEnvelopes(updated);
    localStorage.setItem("envelopes", JSON.stringify(updated));
    setEditingEnvelope(null);
  };

  const deleteEnvelope = (id: string) => {
    const updated = envelopes.filter((env) => env.id !== id);
    setEnvelopes(updated);
    localStorage.setItem("envelopes", JSON.stringify(updated));
    setDeleteEnvelopeId(null);
  };

  const totalAllocated = envelopes.reduce((sum, env) => sum + env.allocated, 0);
  const totalSpent = envelopes.reduce((sum, env) => sum + env.spent, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Envelope Budgeting</h1>
        <p className="text-violet-100">
          Allocate and track your spending by category
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-violet-600 to-purple-600 border-0">
          <p className="text-violet-100 mb-2">Total Allocated</p>
          <p className="text-white">₱{totalAllocated.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 border-0">
          <p className="text-blue-100 mb-2">Total Spent</p>
          <p className="text-white">₱{totalSpent.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 border-0">
          <p className="text-green-100 mb-2">Remaining</p>
          <p className="text-white">
            ₱{(totalAllocated - totalSpent).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Add Envelope Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Envelope
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Envelope</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const allocated = parseFloat(
                  formData.get("allocated") as string
                );
                const icon = formData.get("icon") as string;
                addEnvelope(name, allocated, icon);
                e.currentTarget.reset();
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Groceries"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="allocated">Monthly Budget</Label>
                  <Input
                    id="allocated"
                    name="allocated"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select name="icon" defaultValue="Heart">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ShoppingCart">
                        🛒 Shopping Cart
                      </SelectItem>
                      <SelectItem value="Car">🚗 Car</SelectItem>
                      <SelectItem value="Coffee">☕ Coffee</SelectItem>
                      <SelectItem value="Film">🎬 Film</SelectItem>
                      <SelectItem value="Heart">❤️ Heart</SelectItem>
                      <SelectItem value="Home">🏠 Home</SelectItem>
                      <SelectItem value="Utensils">🍴 Utensils</SelectItem>
                      <SelectItem value="Plane">✈️ Plane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create Envelope
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Envelopes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {envelopes.map((envelope) => {
          const Icon = iconMap[envelope.icon as keyof typeof iconMap] || Heart;
          const percentage = (envelope.spent / envelope.allocated) * 100;
          const remaining = envelope.allocated - envelope.spent;
          const formattedAllocated = `₱${envelope.allocated.toFixed(2)}`;
          const formattedSpent = `₱${envelope.spent.toFixed(2)}`;
          const formattedRemaining = `₱${Math.abs(remaining).toFixed(2)}`;

          return (
            <Card
              key={envelope.id}
              className="p-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${envelope.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-violet-900 dark:text-violet-100">
                      {envelope.name}
                    </h3>
                    <p className="text-violet-600 dark:text-violet-300">
                      {formattedAllocated}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={editingEnvelope?.id === envelope.id}
                    onOpenChange={(open) => !open && setEditingEnvelope(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEnvelope(envelope)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {envelope.name}</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const name = formData.get("name") as string;
                          const allocated = parseFloat(
                            formData.get("allocated") as string
                          );
                          const spent = parseFloat(
                            formData.get("spent") as string
                          );
                          const icon = formData.get("icon") as string;
                          updateEnvelope(
                            envelope.id,
                            name,
                            allocated,
                            spent,
                            icon
                          );
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={envelope.name}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="allocated">Monthly Budget</Label>
                            <Input
                              id="allocated"
                              name="allocated"
                              type="number"
                              step="0.01"
                              defaultValue={envelope.allocated}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="spent">Amount Spent</Label>
                            <Input
                              id="spent"
                              name="spent"
                              type="number"
                              step="0.01"
                              defaultValue={envelope.spent}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="icon">Icon</Label>
                            <Select name="icon" defaultValue={envelope.icon}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ShoppingCart">
                                  🛒 Shopping Cart
                                </SelectItem>
                                <SelectItem value="Car">🚗 Car</SelectItem>
                                <SelectItem value="Coffee">
                                  ☕ Coffee
                                </SelectItem>
                                <SelectItem value="Film">🎬 Film</SelectItem>
                                <SelectItem value="Heart">❤️ Heart</SelectItem>
                                <SelectItem value="Home">🏠 Home</SelectItem>
                                <SelectItem value="Utensils">
                                  🍴 Utensils
                                </SelectItem>
                                <SelectItem value="Plane">✈️ Plane</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit" className="w-full">
                            Update Envelope
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteEnvelopeId(envelope.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <Progress value={percentage} className="mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-violet-50 dark:bg-violet-900/30 rounded-lg p-3">
                  <p className="text-violet-600 dark:text-violet-300 mb-1">
                    Spent
                  </p>
                  <p className="text-violet-900 dark:text-violet-100">
                    {formattedSpent}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    remaining >= 0
                      ? "bg-green-50 dark:bg-green-900/30"
                      : "bg-red-50 dark:bg-red-900/30"
                  }`}
                >
                  <p
                    className={`mb-1 ${
                      remaining >= 0
                        ? "text-green-600 dark:text-green-300"
                        : "text-red-600 dark:text-red-300"
                    }`}
                  >
                    Remaining
                  </p>
                  <p
                    className={
                      remaining >= 0
                        ? "text-green-900 dark:text-green-100"
                        : "text-red-900 dark:text-red-100"
                    }
                  >
                    {formattedRemaining}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteEnvelopeId !== null}
        onOpenChange={() => setDeleteEnvelopeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Envelope?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              envelope.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteEnvelopeId && deleteEnvelope(deleteEnvelopeId)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
