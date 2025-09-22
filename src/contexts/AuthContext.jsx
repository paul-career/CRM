import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const initialUsers = [
  { id: 1, email: 'admin@crm.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, email: 'sales@crm.com', password: 'sales123', role: 'sales', name: 'Sales Manager' },
  { id: 3, email: 'user@crm.com', password: 'user123', role: 'user', name: 'Regular User' },
  { id: 4, email: 'sales.agent1@crm.com', password: 'password', role: 'sales', name: 'Alice' },
  { id: 5, email: 'sales.agent2@crm.com', password: 'password', role: 'user', name: 'Bob' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useLocalStorage('crmUsers', initialUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('crmUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (credentials) => {
    const { email, password } = credentials;
    
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('crmUser', JSON.stringify(foundUser));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crmUser');
  };
  
  const addUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const updateUser = (userId, updatedData) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };
  
  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };
  
  const getAssignableUsers = () => {
    return users.filter(u => u.role === 'sales' || u.role === 'user');
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const permissions = {
      admin: ['dashboard', 'accounts', 'leads', 'meeting', 'finance', 'reports', 'user-management', 'settings', 'import-leads'],
      sales: ['dashboard', 'accounts', 'leads', 'meeting', 'finance', 'reports', 'settings', 'import-leads'],
      user: ['dashboard', 'leads', 'meeting']
    };
    
    const userPermissions = permissions[user.role];
    return userPermissions ? userPermissions.includes(permission) : false;
  };

  const value = {
    user,
    users,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    getAssignableUsers,
    hasPermission,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
