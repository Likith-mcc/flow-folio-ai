import React from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { TrendingUp, TrendingDown, Target, Wallet, Calendar, PiggyBank } from 'lucide-react';

const StatsOverview: React.FC = () => {
  const { stats } = useExpenses();
  const savingsProgress = (stats.currentSavings / stats.savingsGoal) * 100;
  const isOnTrack = stats.currentSavings > 0;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Monthly Spent */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border border-border/20 hover:shadow-elegant transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">${stats.monthlySpent.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly expenses</p>
            </div>
            <div className="w-12 h-12 bg-expense-food/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-expense-food" />
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border border-border/20 hover:shadow-elegant transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-expense-transport/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-expense-transport" />
            </div>
          </div>
        </div>

        {/* Savings Goal */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border border-border/20 hover:shadow-elegant transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Savings Goal</p>
              <p className="text-2xl font-bold">${stats.savingsGoal.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-success rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, savingsProgress)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{savingsProgress.toFixed(0)}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Current Savings */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border border-border/20 hover:shadow-elegant transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Savings</p>
              <p className={`text-2xl font-bold ${isOnTrack ? 'text-success' : 'text-destructive'}`}>
                ${stats.currentSavings.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isOnTrack ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={`text-xs ${isOnTrack ? 'text-success' : 'text-destructive'}`}>
                  {isOnTrack ? 'On track!' : 'Over budget'}
                </span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isOnTrack ? 'bg-success/20' : 'bg-destructive/20'
            }`}>
              <PiggyBank className={`w-6 h-6 ${isOnTrack ? 'text-success' : 'text-destructive'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;