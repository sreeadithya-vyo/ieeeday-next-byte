import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, User } from '@/data/mockUsers';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => boolean;
  logout: () => void;
  signup: (userData: Omit<User, 'id'>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string, rememberMe: boolean): boolean => {
    // Check mock users first
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      }
      return true;
    }

    // Check localStorage for registered users
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      const users: User[] = JSON.parse(registeredUsers);
      const registeredUser = users.find(
        u => u.email === email && u.password === password
      );
      
      if (registeredUser) {
        setUser(registeredUser);
        if (rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify(registeredUser));
        }
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = (userData: Omit<User, 'id'>) => {
    const registeredUsers = localStorage.getItem('registeredUsers');
    const users: User[] = registeredUsers ? JSON.parse(registeredUsers) : [];
    
    const newUser: User = {
      ...userData,
      id: users.length + 100, // Generate ID
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated: !!user }}>
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
