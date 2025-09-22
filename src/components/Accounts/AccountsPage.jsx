import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountsTable from './AccountsTable';
import AccountsKanban from './AccountsKanban';
import AccountDetailsModal from './AccountDetailsModal';

const AccountsPage = ({ accounts, setAccounts }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredAccounts = accounts.filter(account =>
    (account.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.email && account.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleView = (account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (accountId) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
    toast({ title: "Account deleted successfully" });
  };

  const handleSaveAccount = (updatedAccount) => {
    setAccounts(accounts.map(c => c.id === updatedAccount.id ? updatedAccount : c));
    toast({ title: "Client details saved successfully" });
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Clients Logo */}
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              {/* First person (front) */}
              <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M5 18c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              {/* Second person (behind) */}
              <circle cx="16" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M13.5 19c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">Clients</span>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/add-client')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full sm:w-auto">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <List className="w-4 h-4" /> Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div>
        {viewMode === 'table' ? (
          <AccountsTable
            accounts={filteredAccounts}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ) : (
          <AccountsKanban
            accounts={filteredAccounts}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </div>

      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        account={selectedAccount}
        onSave={handleSaveAccount}
      />
    </motion.div>
  );
};

export default AccountsPage;
