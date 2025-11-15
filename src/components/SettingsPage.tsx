import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Settings, Moon, Sun } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export function SettingsPage() {
  const { darkMode, toggleDarkMode } = useSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-yellow-100">Customize your TipidCore experience</p>
      </div>

      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">
                  Dark Mode
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Toggle dark theme
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </Card>
      </div>
    </div>
  );
}
