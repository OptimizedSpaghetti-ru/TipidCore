import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { PiggyBank, Target, Wallet, TrendingUp, Shield, Mail } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-900 dark:text-yellow-100">TipidCore</span>
          </div>
          <Link to="/app/dashboard">
            <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20">Get Started</Button>
          </Link>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-yellow-900 dark:text-yellow-100 mb-6">
            Your Money Journey,
            <br />
            <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Simplified & Gamified
            </span>
          </h1>
          <p className="text-yellow-700 dark:text-yellow-300 mb-8 max-w-2xl mx-auto">
            Track your finances, build savings habits, and achieve your goals with a friendly interface 
            that makes money management actually enjoyable.
          </p>
          <Link to="/app/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white">
              Start Tracking Free
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          <FeatureCard
            icon={<PiggyBank className="w-6 h-6" />}
            title="Gamified Savings"
            description="Build daily saving habits with streaks, rewards, and a visual piggybank that fills as you save."
          />
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="Custom Goals"
            description="Set specific saving goals with automatic daily amount calculations and beautiful progress tracking."
          />
          <FeatureCard
            icon={<Wallet className="w-6 h-6" />}
            title="Envelope Budgeting"
            description="Allocate your money into digital envelopes for food, transportation, and other categories."
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Debt Tracker"
            description="Monitor loans and outstanding balances with clear visualizations of your payoff progress."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Emergency Fund"
            description="Build your safety net with a dedicated tracker showing your progress toward financial security."
          />
          <FeatureCard
            icon={<Mail className="w-6 h-6" />}
            title="Future Me Notes"
            description="Write motivational notes to your future self tied to goals and milestones."
          />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-white mb-4">Ready to Transform Your Finances?</h2>
          <p className="text-yellow-100 mb-8">
            Join thousands taking control of their money with TipidCore
          </p>
          <Link to="/app/dashboard">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-600 transition-colors">
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-4">
        {icon}
      </div>
      <h3 className="text-yellow-900 dark:text-yellow-100 mb-2">{title}</h3>
      <p className="text-yellow-600 dark:text-yellow-300">{description}</p>
    </div>
  );
}