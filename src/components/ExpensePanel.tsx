import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useExpenses, CATEGORY_EMOJIS, CATEGORY_COLORS } from '@/contexts/ExpenseContext';
import { Plus, Trash2, Settings, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const ExpensePanel: React.FC = () => {
  const { expenses, addExpense, removeExpense, stats, updateSavingsGoal } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [newSavingsGoal, setNewSavingsGoal] = useState(stats.savingsGoal.toString());
  const [showGoalInput, setShowGoalInput] = useState(false);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description) return;

    addExpense({
      amount: parseFloat(amount),
      category: category as any,
      description,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setCategory('');
    setDescription('');
  };

  const handleUpdateGoal = () => {
    const goal = parseFloat(newSavingsGoal);
    if (goal > 0) {
      updateSavingsGoal(goal);
      setShowGoalInput(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    return CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || 'primary';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Expense Tracker</h2>
            <p className="text-sm text-muted-foreground">Manage your spending</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGoalInput(!showGoalInput)}
            className="w-8 h-8"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Savings Goal Input */}
        {showGoalInput && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-3">
            <Label htmlFor="savingsGoal" className="text-sm">Monthly Savings Goal</Label>
            <div className="flex gap-2">
              <Input
                id="savingsGoal"
                type="number"
                value={newSavingsGoal}
                onChange={(e) => setNewSavingsGoal(e.target.value)}
                placeholder="1000"
                className="h-9"
              />
              <Button size="sm" onClick={handleUpdateGoal}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Form */}
      <div className="p-4 border-b border-border/50">
        <Card className="border-0 bg-gradient-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 h-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_EMOJIS).map(([key, emoji]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{emoji}</span>
                          <span className="capitalize">{key}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Input
                  id="description"
                  placeholder="What did you buy?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-9"
                  required
                />
              </div>

              <Button type="submit" variant="success" className="w-full" size="sm">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Recent Expenses</h3>
          <Badge variant="secondary" className="text-xs">
            {expenses.length} total
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-28rem)]">
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8" />
                </div>
                <p className="text-sm">No expenses yet</p>
                <p className="text-xs">Add your first expense above</p>
              </div>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/20 hover:shadow-card transition-smooth group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm",
                      `bg-${getCategoryColor(expense.category)}/20`
                    )}>
                      {CATEGORY_EMOJIS[expense.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{expense.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs capitalize">
                          {expense.category}
                        </Badge>
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${expense.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExpense(expense.id)}
                      className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ExpensePanel;