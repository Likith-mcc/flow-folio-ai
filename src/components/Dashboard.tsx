import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import AIChat from './AIChat';
import ExpensePanel from './ExpensePanel';
import Header from './Header';
import StatsOverview from './StatsOverview';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useExpenses();

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Expense Panel */}
        <div className="w-80 border-r border-border/50 bg-card/50 backdrop-blur-sm">
          <ExpensePanel />
        </div>

        {/* Main Content - AI Chat */}
        <div className="flex-1 flex flex-col">
          {/* Stats Overview */}
          <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
            <StatsOverview />
          </div>
          
          {/* AI Chat Interface */}
          <div className="flex-1">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;