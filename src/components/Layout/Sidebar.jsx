import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, BarChart, DollarSign, Settings, UserCog, LogOut, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard', permissions: ['admin', 'sales', 'user'] },
  { icon: Users, label: 'Accounts', section: 'accounts', permissions: ['admin', 'sales'] },
  { icon: BarChart, label: 'Leads', section: 'leads', permissions: ['admin', 'sales', 'user'] },
  { icon: DollarSign, label: 'Finance', section: 'finance', permissions: ['admin', 'sales'] },
  { icon: BarChart, label: 'Reports', section: 'reports', permissions: ['admin', 'sales'] },
  { icon: UserCog, label: 'User Management', section: 'user-management', permissions: ['admin'] },
  { icon: Settings, label: 'Settings', section: 'settings', permissions: ['admin', 'sales', 'user'] },
];

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </button>
);

const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const handleNavigation = (section) => {
    setActiveSection(section);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-white">CRM</span>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden text-slate-400" onClick={() => setIsOpen(false)}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {navItems.map(item =>
          user.permissions.includes(item.section) && (
            <NavItem
              key={item.section}
              icon={item.icon}
              label={item.label}
              isActive={activeSection === item.section}
              onClick={() => handleNavigation(item.section)}
            />
          )
        )}
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-800/50 border-r border-slate-700">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-slate-800 z-50 flex flex-col lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
