import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, LayoutGrid, List, User, Shield, Phone, Mail, MapPin, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountsTable from './AccountsTable';
import AccountsKanban from './AccountsKanban';
import AccountDetailsModal from './AccountDetailsModal';

const AccountsPage = ({ accounts, setAccounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    email: '',
    location: '',
    status: 'pending'
  });
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClient = () => {
    if (!formData.name || !formData.company || !formData.email) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newAccount = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccounts([newAccount, ...accounts]);
    setShowAddForm(false);
    setFormData({
      name: '',
      company: '',
      contact: '',
      email: '',
      location: '',
      status: 'pending'
    });
    toast({ title: "Client added successfully" });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      name: '',
      company: '',
      contact: '',
      email: '',
      location: '',
      status: 'pending'
    });
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
          {showAddForm && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancelAdd}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
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
          <span className="text-2xl font-bold text-white">
            {showAddForm ? 'Add New Client' : 'Clients'}
          </span>
        </div>
        {!showAddForm && (
          <div className="flex gap-3">
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Client
            </Button>
          </div>
        )}
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 mb-6">Create a new client record in your CRM system</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4" /> Client Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2 text-slate-300">
                    <Shield className="w-4 h-4" /> Company *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4" /> Phone
                  </Label>
                  <Input
                    id="contact"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contact}
                    onChange={(e) => handleFormChange('contact', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4" /> Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@company.com"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4" /> Location
                </Label>
                <Input
                  id="location"
                  placeholder="New York, USA"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleFormChange('status', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelAdd}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleAddClient} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Save className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and View Toggle - Only show when not in add form mode */}
      {!showAddForm && (
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
      )}

      {/* Content - Only show when not in add form mode */}
      {!showAddForm && (
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
      )}

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
