import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'education' | 'other';
  description: string;
  date: string;
  createdAt: string;
}

interface ExpenseStats {
  totalSpent: number;
  monthlySpent: number;
  categorySpendings: Record<string, number>;
  savingsGoal: number;
  currentSavings: number;
}

interface ExpenseContextType {
  expenses: Expense[];
  stats: ExpenseStats;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  removeExpense: (id: string) => void;
  updateSavingsGoal: (goal: number) => void;
  clearAllExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const CATEGORY_COLORS = {
  food: 'expense-food',
  transport: 'expense-transport',
  entertainment: 'expense-entertainment',
  education: 'expense-education',
  other: 'primary'
};

const CATEGORY_EMOJIS = {
  food: '🍕',
  transport: '🚗',
  entertainment: '🎬',
  education: '📚',
  other: '💰'
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const { toast } = useToast();

  useEffect(() => {
    // Load expenses and savings goal from localStorage
    const savedExpenses = localStorage.getItem('expense-manager-expenses');
    const savedGoal = localStorage.getItem('expense-manager-savings-goal');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedGoal) {
      setSavingsGoal(JSON.parse(savedGoal));
    }
  }, []);

  useEffect(() => {
    // Save expenses to localStorage whenever they change
    localStorage.setItem('expense-manager-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    // Save savings goal to localStorage
    localStorage.setItem('expense-manager-savings-goal', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setExpenses(prev => [newExpense, ...prev]);
    
    const emoji = CATEGORY_EMOJIS[expense.category];
    toast({
      title: `${emoji} Expense Added`,
      description: `$${expense.amount} for ${expense.description}`,
      duration: 2000,
    });
  };

  const removeExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    
    if (expense) {
      toast({
        title: "Expense removed",
        description: `$${expense.amount} expense deleted`,
        duration: 2000,
      });
    }
  };

  const updateSavingsGoal = (goal: number) => {
    setSavingsGoal(goal);
    toast({
      title: "🎯 Savings goal updated!",
      description: `New target: $${goal}`,
      duration: 2000,
    });
  };

  const clearAllExpenses = () => {
    setExpenses([]);
    toast({
      title: "All expenses cleared",
      description: "Fresh start! 🌟",
      duration: 2000,
    });
  };

  // Calculate stats
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpent = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categorySpendings = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const currentSavings = Math.max(0, savingsGoal - monthlySpent);

  const stats: ExpenseStats = {
    totalSpent,
    monthlySpent,
    categorySpendings,
    savingsGoal,
    currentSavings,
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      stats,
      addExpense,
      removeExpense,
      updateSavingsGoal,
      clearAllExpenses,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export { CATEGORY_COLORS, CATEGORY_EMOJIS };