import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountsTable from './AccountsTable';
import AccountsKanban from './AccountsKanban';
import AccountDetailsModal from './AccountDetailsModal';
import AddAccountModal from './AddAccountModal';

const AccountsPage = ({ accounts, setAccounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const handleAddAccount = (newAccount) => {
    setAccounts([newAccount, ...accounts]);
    toast({ title: "Client added successfully" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-2xl font-bold text-white">Clients</span>
          <p className="text-slate-400 mt-1">Manage your clients and customer relationships</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
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
      
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAccount}
      />
    </motion.div>
  );
};

export default AccountsPage;
