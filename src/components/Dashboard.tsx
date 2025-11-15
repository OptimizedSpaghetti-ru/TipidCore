import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  Wallet,
  TrendingUp,
  Edit,
  Trash2,
  Building,
  CreditCard,
  Landmark,
  Banknote,
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

interface BankAccount {
  id: string;
  name: string;
  balance: number;
  color: string;
  icon?: string;
}

const iconMap = {
  Wallet,
  Building,
  CreditCard,
  Landmark,
  Banknote,
};

export function Dashboard() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bankAccounts");
    if (saved) {
      const parsedAccounts = JSON.parse(saved);
      // Migrate old accounts to include icon
      const migratedAccounts = parsedAccounts.map((acc: BankAccount) => ({
        ...acc,
        icon: acc.icon || "Wallet",
      }));
      setAccounts(migratedAccounts);
    } else {
      const defaultAccounts = [
        {
          id: "1",
          name: "Main Checking",
          balance: 0,
          color: "from-blue-500 to-blue-600",
          icon: "Wallet",
        },
        {
          id: "2",
          name: "Savings Account",
          balance: 0,
          color: "from-green-500 to-green-600",
          icon: "Building",
        },
      ];
      setAccounts(defaultAccounts);
      localStorage.setItem("bankAccounts", JSON.stringify(defaultAccounts));
    }
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const addAccount = (name: string, balance: number, icon: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-orange-500 to-orange-600",
    ];

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      name,
      balance,
      color: colors[accounts.length % colors.length],
      icon,
    };

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    localStorage.setItem("bankAccounts", JSON.stringify(updated));
    setIsAddDialogOpen(false);
  };

  const updateAccount = (
    id: string,
    name: string,
    balance: number,
    icon: string
  ) => {
    const updated = accounts.map((acc) =>
      acc.id === id ? { ...acc, name, balance, icon } : acc
    );
    setAccounts(updated);
    localStorage.setItem("bankAccounts", JSON.stringify(updated));
    setEditingAccount(null);
  };

  const deleteAccount = (id: string) => {
    const updated = accounts.filter((acc) => acc.id !== id);
    setAccounts(updated);
    localStorage.setItem("bankAccounts", JSON.stringify(updated));
    setDeleteAccountId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Dashboard</h1>
        <p className="text-violet-100">Overview of your financial accounts</p>
      </div>

      {/* Total Balance Card - Always shows in $ (global view) */}
      <Card className="mb-8 bg-gradient-to-br from-violet-600 to-purple-600 border-0 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-100 mb-2">Total Balance</p>
            <h2 className="text-white">
              ₱
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      {/* Bank Accounts Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-violet-900 dark:text-violet-100">Bank Accounts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Add New Account
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const balance = parseFloat(formData.get("balance") as string);
                const icon = formData.get("icon") as string;
                addAccount(name, balance, icon);
                e.currentTarget.reset();
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Checking Account"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select name="icon" defaultValue="Wallet">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wallet">💳 Wallet</SelectItem>
                      <SelectItem value="Building">🏢 Building</SelectItem>
                      <SelectItem value="CreditCard">💳 Credit Card</SelectItem>
                      <SelectItem value="Landmark">🏛️ Landmark</SelectItem>
                      <SelectItem value="Banknote">💵 Banknote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Add Account
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const Icon = iconMap[account.icon as keyof typeof iconMap] || Wallet;
          const formattedBalance = `₱${account.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;

          return (
            <Card
              key={account.id}
              className="p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${account.color} rounded-xl flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={editingAccount?.id === account.id}
                    onOpenChange={(open) => !open && setEditingAccount(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAccount(account)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">
                          Edit Account
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const name = formData.get("name") as string;
                          const balance = parseFloat(
                            formData.get("balance") as string
                          );
                          const icon = formData.get("icon") as string;
                          updateAccount(account.id, name, balance, icon);
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Account Name</Label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={account.name}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="balance">Balance</Label>
                            <Input
                              id="balance"
                              name="balance"
                              type="number"
                              step="0.01"
                              defaultValue={account.balance}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="icon">Icon</Label>
                            <Select
                              name="icon"
                              defaultValue={account.icon || "Wallet"}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Wallet">
                                  💳 Wallet
                                </SelectItem>
                                <SelectItem value="Building">
                                  🏢 Building
                                </SelectItem>
                                <SelectItem value="CreditCard">
                                  💳 Credit Card
                                </SelectItem>
                                <SelectItem value="Landmark">
                                  🏛️ Landmark
                                </SelectItem>
                                <SelectItem value="Banknote">
                                  💵 Banknote
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit" className="w-full">
                            Update Account
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteAccountId(account.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">
                {account.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {formattedBalance}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteAccountId !== null}
        onOpenChange={() => setDeleteAccountId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              bank account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccountId && deleteAccount(deleteAccountId)}
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
