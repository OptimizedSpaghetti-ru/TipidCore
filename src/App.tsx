import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { PiggybankPage } from "./components/PiggybankPage";
import { GoalsPage } from "./components/GoalsPage";
import { GoalCreationPage } from "./components/GoalCreationPage";
import { DebtTrackerPage } from "./components/DebtTrackerPage";
import { EnvelopeBudgetingPage } from "./components/EnvelopeBudgetingPage";
import { EmergencyFundPage } from "./components/EmergencyFundPage";
import { FutureMeNotesPage } from "./components/FutureMeNotesPage";
import { SettingsPage } from "./components/SettingsPage";
import { MainLayout } from "./components/MainLayout";

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="piggybank" element={<PiggybankPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="goals/create" element={<GoalCreationPage />} />
              <Route path="debt" element={<DebtTrackerPage />} />
              <Route path="envelopes" element={<EnvelopeBudgetingPage />} />
              <Route path="emergency-fund" element={<EmergencyFundPage />} />
              <Route path="future-notes" element={<FutureMeNotesPage />} />
            </Route>
            {/* Catch all unmatched routes */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}
