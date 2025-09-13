import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Sparkles, Bot, User, TrendingUp, Target } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 I'm your AI financial assistant. I'm here to help you manage your expenses, set savings goals, and make smarter financial decisions. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { stats, expenses } = useExpenses();
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Expense analysis
    if (message.includes('spent') || message.includes('spending') || message.includes('expenses')) {
      const topCategory = Object.entries(stats.categorySpendings)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        return `You've spent $${stats.monthlySpent.toFixed(2)} this month. Your biggest expense category is ${topCategory[0]} with $${topCategory[1].toFixed(2)}. ${
          stats.currentSavings > 0 
            ? `Great news! You're still on track with $${stats.currentSavings.toFixed(2)} left in your budget. Keep it up! 🎯`
            : `You're over budget by $${Math.abs(stats.currentSavings).toFixed(2)}. Consider reducing ${topCategory[0]} expenses or adjusting your savings goal. 💡`
        }`;
      }
      return `You've spent $${stats.monthlySpent.toFixed(2)} this month out of your $${stats.savingsGoal} goal.`;
    }

    // Savings advice
    if (message.includes('save') || message.includes('saving') || message.includes('goal')) {
      const savingsRate = ((stats.savingsGoal - stats.monthlySpent) / stats.savingsGoal * 100);
      return `Your savings goal is $${stats.savingsGoal}. You've spent $${stats.monthlySpent.toFixed(2)}, which means you're ${
        savingsRate > 0 
          ? `doing great with ${savingsRate.toFixed(1)}% of your goal remaining! 🌟` 
          : `over budget. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Start small and build the habit! 💪`
      }`;
    }

    // Category advice
    if (message.includes('food') || message.includes('eating')) {
      const foodSpending = stats.categorySpendings.food || 0;
      return `You've spent $${foodSpending.toFixed(2)} on food this month. Here are some tips: meal prep on Sundays, cook at home more often, and try the "$5 lunch challenge" - pack lunch instead of buying it! 🍱`;
    }

    if (message.includes('transport') || message.includes('travel')) {
      const transportSpending = stats.categorySpendings.transport || 0;
      return `Transportation costs: $${transportSpending.toFixed(2)} this month. Consider carpooling, public transit, or biking when possible. Even walking more can save money and improve your health! 🚲`;
    }

    // Budget tips
    if (message.includes('tip') || message.includes('advice') || message.includes('help')) {
      const tips = [
        "Try the 24-hour rule: wait a day before making non-essential purchases. You might find you don't need it! 🤔",
        "Use the envelope method: allocate cash for each spending category. When it's gone, you're done for the month! 💰",
        "Track every expense for a week - you'll be amazed at where your money goes! 📊",
        "Set up automatic transfers to savings so you save before you spend! 🏦",
        "Use apps to find coupons and cashback before shopping. Every dollar saved is a dollar earned! 🎯"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // Recent expenses
    if (message.includes('recent') || message.includes('last')) {
      const recentExpenses = expenses.slice(0, 3);
      if (recentExpenses.length > 0) {
        const expenseList = recentExpenses
          .map(e => `$${e.amount} on ${e.description}`)
          .join(', ');
        return `Your recent expenses: ${expenseList}. ${
          recentExpenses.some(e => e.amount > 50) 
            ? "I notice some larger purchases - make sure they align with your financial goals! 🎯" 
            : "Good job on keeping expenses reasonable! 👏"
        }`;
      }
      return "You haven't recorded any expenses yet. Start tracking to get personalized insights! 📝";
    }

    // Default responses
    const responses = [
      `I'm here to help you manage your finances better! You currently have $${stats.currentSavings.toFixed(2)} left in your monthly budget. What would you like to know? 💡`,
      `Great question! Based on your spending of $${stats.monthlySpent.toFixed(2)} this month, I can help you optimize your budget. What specific area interests you? 📊`,
      `Let's work together to improve your financial health! You're currently ${
        stats.currentSavings > 0 ? 'on track' : 'over budget'
      } this month. Ask me about saving tips, expense analysis, or budgeting strategies! 🚀`,
      `I love helping students save money! With $${stats.totalSpent.toFixed(2)} in total expenses tracked, we can find patterns and opportunities to save. What's on your mind? 🎓`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-card">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              AI Financial Assistant
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </h2>
            <p className="text-sm text-muted-foreground">Smart insights for your spending</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className={
                  message.role === 'user' 
                    ? 'bg-gradient-primary text-white'
                    : 'bg-gradient-hero text-white'
                }>
                  {message.role === 'user' ? (
                    user?.avatar || <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>

              <Card className={`max-w-md shadow-card border-0 ${
                message.role === 'user'
                  ? 'bg-gradient-primary text-primary-foreground ml-auto'
                  : 'bg-gradient-card'
              }`}>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-hero text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your expenses, savings goals, or financial advice..."
                className="pr-12 h-11 bg-background/50 border-border/50 focus:border-primary transition-smooth"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-11 w-11"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {[
              { icon: TrendingUp, text: "Analyze my spending", query: "How much have I spent?" },
              { icon: Target, text: "Savings tips", query: "Give me savings tips" },
              { icon: Sparkles, text: "Recent expenses", query: "Show my recent expenses" }
            ].map((action, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                onClick={() => setInput(action.query)}
                className="flex-shrink-0 text-xs gap-1 h-8"
              >
                <action.icon className="w-3 h-3" />
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;