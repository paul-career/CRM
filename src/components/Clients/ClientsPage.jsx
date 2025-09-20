import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientsTable from './ClientsTable';
import ClientsKanban from './ClientsKanban';
import ClientDetailsModal from './ClientDetailsModal';
import AddClientModal from './AddClientModal';

const ClientsPage = ({ clients, setClients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleView = (client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (clientId) => {
    setClients(clients.filter(client => client.id !== clientId));
    toast({ title: "Client deleted successfully" });
  };

  const handleSaveClient = (updatedClient) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    toast({ title: "Client details saved successfully" });
  };

  const handleAddClient = (newClient) => {
    setClients([newClient, ...clients]);
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
          <p className="text-slate-400 mt-1">Manage your client database</p>
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
          <ClientsTable
            clients={filteredClients}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ) : (
          <ClientsKanban
            clients={filteredClients}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        client={selectedClient}
        onSave={handleSaveClient}
      />
      
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
      />
    </motion.div>
  );
};

export default ClientsPage;