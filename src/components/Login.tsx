import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Sparkles, TrendingUp, PiggyBank } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const fillDemo = () => {
    setEmail('student@demo.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow animate-glow">
                <PiggyBank className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Savings
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-Powered Student Expense Manager
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <TrendingUp className="w-4 h-4" />
              <span>Track • Save • Grow</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-card shadow-elegant border-0 backdrop-blur-sm animate-slide-in">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
            <CardDescription className="text-center">
              Sign in to your financial journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background/50 border-border/50 focus:border-primary transition-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-background/50 border-border/50 focus:border-primary transition-smooth"
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Account */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Account</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={fillDemo}
              type="button"
            >
              Try Demo Account
            </Button>

            {/* Demo Credentials */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium text-center mb-2">Demo Credentials:</p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                <p><span className="font-medium">Email:</span> student@demo.com</p>
                <p><span className="font-medium">Password:</span> demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center animate-fade-in">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Smart Analytics</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <PiggyBank className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Savings Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;