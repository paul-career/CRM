import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Phone, Plus, Upload, Filter, UserPlus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CallLogModal from './CallLogModal';
import LeadDetailsModal from './LeadDetailsModal';
import EditLeadModal from './EditLeadModal';
import ImportLeadsModal from './ImportLeadsModal';
import AssignLeadsModal from './AssignLeadsModal';

const LeadsTable = ({ leads, setLeads, onLeadStatusChange }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('leadName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  
  const [settings] = useLocalStorage('crmSettings', { roundRobin: true });

  const canManageLeads = user.role === 'admin' || user.role === 'sales';
  const canImportLeads = hasPermission('import-leads');

  const filteredLeads = useMemo(() => {
    let leadsToFilter = leads;

    if (user.role === 'user' && user.email) {
      leadsToFilter = leads.filter(lead => lead.assignedTo === user.email);
    }

    return leadsToFilter
      .filter(lead => {
        const matchesSearch = 
          (lead.leadName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.source || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';
        const direction = sortDirection === 'asc' ? 1 : -1;
        return aValue.localeCompare(bValue) * direction;
      });
  }, [leads, searchTerm, statusFilter, sortField, sortDirection, user]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };
  
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };
  
  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsEditLeadModalOpen(true);
  };

  const handleCallCustomer = (lead) => {
    setSelectedLead(lead);
    setIsCallModalOpen(true);
  };
  
  const handleOpenAssignModal = () => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select leads to assign.",
        variant: "destructive"
      });
      return;
    }
    setIsAssignModalOpen(true);
  };
  
  const handleManualAssign = (userId) => {
    setLeads(currentLeads => currentLeads.map(lead =>
      selectedLeads.includes(lead.id) ? { ...lead, assignedTo: userId } : lead
    ));
    toast({ title: `${selectedLeads.length} leads assigned successfully!` });
    setSelectedLeads([]);
  };

  const handleStatusUpdate = (leadId, newStatus) => {
    if (onLeadStatusChange) {
      onLeadStatusChange(leadId, newStatus);
      toast({
        title: newStatus === 'completed' ? "Lead completed and moved to meetings!" : "Lead status updated successfully"
      });
    } else {
      // Fallback to old behavior if onLeadStatusChange is not provided
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      toast({
        title: "Lead status updated successfully"
      });
    }
  };

  
  const handleSaveLead = (leadId, updatedData, historyLog) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const newHistory = historyLog ? [...(lead.callHistory || []), historyLog] : lead.callHistory;
        return { ...lead, ...updatedData, callHistory: newHistory };
      }
      return lead;
    }));
    toast({ title: "Lead updated successfully" });
  };

  const handleImportLeads = (newLeads) => {
    setLeads([...newLeads, ...leads]);
    toast({ title: `${newLeads.length} leads imported successfully!` });
  };

  const handleCallLogSave = (callData) => {
    const newCall = {
      id: Date.now(),
      date: callData.date,
      notes: callData.notes,
      nextFollowUp: callData.nextFollowUp,
      type: 'call'
    };

    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            callHistory: [...(lead.callHistory || []), newCall],
            status: callData.status || lead.status
          }
        : lead
    ));

    toast({
      title: "Call log saved successfully"
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'not-started': 'status-badge status-not-started',
      'in-progress': 'status-badge status-in-progress',
      'completed': 'status-badge status-completed',
      'follow-up': 'status-badge status-follow-up'
    };
    
    const statusLabels = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'follow-up': 'Follow Up'
    };
    
    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {statusLabels[status] || status}
      </span>
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-2xl font-bold text-white">Your Leads</span>
        </div>
        
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          {canImportLeads && (
            <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="flex-1 sm:flex-none flex items-center gap-2">
              <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Import CSV</span>
            </Button>
          )}
          <Button onClick={() => navigate('/add-lead')} className="flex-1 sm:flex-none flex items-center gap-2">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Lead</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="follow-up">Follow Up</SelectItem>
          </SelectContent>
        </Select>
        {canManageLeads && (
          <Button onClick={handleOpenAssignModal} disabled={selectedLeads.length === 0} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Assign ({selectedLeads.length})
          </Button>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              {canManageLeads && (
                <TableHead className="w-12">
                  <Checkbox 
                    checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                    onCheckedChange={(checked) => handleSelectAll({ target: { checked: checked } })}
                  />
                </TableHead>
              )}
              <TableHead className="text-slate-300 cursor-pointer hover:text-white" onClick={() => handleSort('leadName')}>Lead Name {sortField === 'leadName' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
              <TableHead className="text-slate-300 cursor-pointer hover:text-white" onClick={() => handleSort('source')}>Source {sortField === 'source' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
              <TableHead className="text-slate-300">Contact</TableHead>
              <TableHead className="text-slate-300">Company</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Assigned To</TableHead>
              <TableHead className="text-slate-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-slate-700 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-blue-900/50' : 'hover:bg-slate-800/30'}`}
              >
                {canManageLeads && (
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleSelectLead(lead.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="text-white font-medium">
                  <span className="inline-block">
                    {lead.leadName}
                  </span>
                </TableCell>
                <TableCell className="text-slate-300">{lead.source}</TableCell>
                <TableCell className="text-slate-300">{lead.contact}</TableCell>
                <TableCell className="text-slate-300">{lead.company}</TableCell>
                <TableCell>
                  <Select value={lead.status} onValueChange={(value) => handleStatusUpdate(lead.id, value)}>
                    <SelectTrigger className="w-32 h-8 bg-transparent border-none p-0">
                      {getStatusBadge(lead.status)}
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="follow-up">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-slate-300">{lead.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button size="icon" variant="ghost" onClick={() => handleViewDetails(lead)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-8 h-8"><Eye className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleCallCustomer(lead)} className="text-green-400 hover:text-green-300 hover:bg-green-500/20 w-8 h-8"><Phone className="w-4 h-4" /></Button>
                    {canManageLeads && <Button size="icon" variant="ghost" onClick={() => handleEditLead(lead)} className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 w-8 h-8"><Edit className="w-4 h-4" /></Button>}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {canManageLeads && (
          <div className="flex items-center p-2">
            <Checkbox 
              id="select-all-mobile"
              checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
              onCheckedChange={(checked) => handleSelectAll({ target: { checked: checked } })}
            />
            <label htmlFor="select-all-mobile" className="ml-3 text-sm text-slate-300">Select All</label>
          </div>
        )}
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg transition-colors ${selectedLeads.includes(lead.id) ? 'bg-blue-900/50' : 'bg-slate-800/30'} border border-slate-700`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {canManageLeads && (
                  <Checkbox
                    className="mt-1"
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleSelectLead(lead.id)}
                  />
                )}
                <div>
                  <span className="font-bold text-white">
                    {lead.leadName}
                  </span>
                  <p className="text-sm text-slate-400">{lead.company}</p>
                </div>
              </div>
              <Select value={lead.status} onValueChange={(value) => handleStatusUpdate(lead.id, value)}>
                <SelectTrigger className="w-auto h-8 bg-transparent border-none p-0">
                  {getStatusBadge(lead.status)}
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="follow-up">Follow Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2 text-sm">
              <p className="text-slate-300"><strong>Contact:</strong> {lead.contact}</p>
              <p className="text-slate-300"><strong>Assigned:</strong> {lead.assignedTo}</p>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button size="icon" variant="ghost" onClick={() => handleViewDetails(lead)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-9 h-9"><Eye className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleCallCustomer(lead)} className="text-green-400 hover:text-green-300 hover:bg-green-500/20 w-9 h-9"><Phone className="w-5 h-5" /></Button>
              {canManageLeads && <Button size="icon" variant="ghost" onClick={() => handleEditLead(lead)} className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 w-9 h-9"><Edit className="w-5 h-5" /></Button>}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-8"><p className="text-slate-400">No leads found</p></div>
      )}

      <CallLogModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} lead={selectedLead} onSave={handleCallLogSave} />
      <LeadDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} lead={selectedLead} />
      <EditLeadModal isOpen={isEditLeadModalOpen} onClose={() => setIsEditLeadModalOpen(false)} lead={selectedLead} onSave={handleSaveLead} />
      <ImportLeadsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImportLeads} roundRobinEnabled={settings.roundRobin} />
      {canManageLeads && <AssignLeadsModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onAssign={handleManualAssign} />}
    </motion.div>
  );
};

export default LeadsTable;
