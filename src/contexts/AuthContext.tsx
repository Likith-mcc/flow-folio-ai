import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for fake authentication
const DEMO_USERS = [
  { id: '1', email: 'student@demo.com', password: 'demo123', name: 'Alex Student', avatar: '👨‍🎓' },
  { id: '2', email: 'jane@demo.com', password: 'jane123', name: 'Jane Smith', avatar: '👩‍🎓' },
  { id: '3', email: 'test@demo.com', password: 'test123', name: 'Test User', avatar: '🎯' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('expense-manager-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userProfile = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar
      };
      
      setUser(userProfile);
      localStorage.setItem('expense-manager-user', JSON.stringify(userProfile));
      
      toast({
        title: "Welcome back! 🎉",
        description: `Hello ${foundUser.name}, let's manage your expenses!`,
        duration: 3000,
      });
      
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try student@demo.com / demo123",
        variant: "destructive",
        duration: 4000,
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expense-manager-user');
    localStorage.removeItem('expense-manager-expenses');
    toast({
      title: "Logged out successfully",
      description: "See you soon! Keep saving money! 💰",
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};