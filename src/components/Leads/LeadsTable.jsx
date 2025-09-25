import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Phone, Plus, Upload, Filter, UserPlus, Edit, User, Building, Mail, ArrowRightCircle, FileText, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ImportLeadsModal from './ImportLeadsModal';
import AssignLeadsModal from './AssignLeadsModal';

const LeadsTable = ({ leads, setLeads, onLeadStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('leadName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showCallView, setShowCallView] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    contact: '',
    email: '',
    source: '',
    status: 'not-started',
    notes: ''
  });
  const [detailsFormData, setDetailsFormData] = useState({});
  const [callFormData, setCallFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    nextFollowUp: '',
    status: ''
  });
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
    setDetailsFormData(lead);
    setShowDetailsView(true);
    setIsEditingDetails(false);
  };
  
  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setDetailsFormData(lead);
    setShowEditView(true);
    setIsEditingDetails(true);
  };

  const handleCallCustomer = (lead) => {
    setSelectedLead(lead);
    setCallFormData({
      date: new Date().toISOString().split('T')[0],
      notes: '',
      nextFollowUp: '',
      status: lead.status
    });
    setShowCallView(true);
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


  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLead = () => {
    if (!formData.leadName || !formData.company || !formData.email) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newLead = {
      ...formData,
      id: Date.now(),
      assignedTo: user.email,
      createdAt: new Date().toISOString(),
      callHistory: []
    };

    setLeads([newLead, ...leads]);
    setShowAddForm(false);
    setFormData({
      leadName: '',
      company: '',
      contact: '',
      email: '',
      source: '',
      status: 'not-started',
      notes: ''
    });
    toast({ title: "Lead added successfully" });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      leadName: '',
      company: '',
      contact: '',
      email: '',
      source: '',
      status: 'not-started',
      notes: ''
    });
  };

  const handleDetailsFormChange = (field, value) => {
    setDetailsFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDetails = () => {
    if (!detailsFormData.leadName || !detailsFormData.company || !detailsFormData.email) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? { ...lead, ...detailsFormData } : lead
    ));
    
    setShowEditView(false);
    setShowDetailsView(false);
    setSelectedLead(null);
    setDetailsFormData({});
    toast({ title: "Lead updated successfully" });
  };

  const handleCancelDetails = () => {
    setShowDetailsView(false);
    setShowEditView(false);
    setSelectedLead(null);
    setDetailsFormData({});
    setIsEditingDetails(false);
  };

  const handleCallFormChange = (field, value) => {
    setCallFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCall = () => {
    // For the Virtual Call dialog, we'll just log a simple call
    const newCall = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      notes: `Virtual call initiated with ${selectedLead.leadName}`,
      nextFollowUp: '',
      type: 'call'
    };

    setLeads(leads.map(lead => 
      lead.id === selectedLead.id 
        ? { 
            ...lead, 
            callHistory: [...(lead.callHistory || []), newCall],
            status: 'in-progress'
          }
        : lead
    ));

    setShowCallView(false);
    setSelectedLead(null);
    setCallFormData({
      date: new Date().toISOString().split('T')[0],
      notes: '',
      nextFollowUp: '',
      status: ''
    });
    toast({ title: "Call initiated successfully" });
  };

  const handleCancelCall = () => {
    setShowCallView(false);
    setSelectedLead(null);
    setCallFormData({
      date: new Date().toISOString().split('T')[0],
      notes: '',
      nextFollowUp: '',
      status: ''
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
        <div className="flex items-center gap-3">
          {(showAddForm || showDetailsView || showCallView || showEditView) && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (showAddForm) handleCancelAdd();
                if (showDetailsView || showEditView) handleCancelDetails();
                if (showCallView) handleCancelCall();
              }}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <span className="text-2xl font-bold text-white">
            {showAddForm ? 'Add New Lead' : 
             showDetailsView ? 'Lead Details' :
             showCallView ? 'Call Log' :
             showEditView ? 'Edit Lead' : 'Your Leads'}
          </span>
        </div>
        
        {!showAddForm && !showDetailsView && !showCallView && !showEditView && (
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {canImportLeads && (
              <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="flex-1 sm:flex-none flex items-center gap-2">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Import CSV</span>
              </Button>
            )}
            <Button onClick={() => setShowAddForm(true)} className="flex-1 sm:flex-none flex items-center gap-2">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Lead</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 mb-6">Create a new lead record in your CRM system</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leadName" className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4" /> Lead Name *
                  </Label>
                  <Input
                    id="leadName"
                    placeholder="Jane Doe"
                    value={formData.leadName}
                    onChange={(e) => handleFormChange('leadName', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4" /> Company *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Innovate Corp."
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
                    <Phone className="w-4 h-4" /> Contact
                  </Label>
                  <Input
                    id="contact"
                    placeholder="+1 555-987-6543"
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
                    placeholder="jane.doe@example.com"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="flex items-center gap-2 text-slate-300">
                  <ArrowRightCircle className="w-4 h-4" /> Source
                </Label>
                <Input
                  id="source"
                  placeholder="e.g., Website, LinkedIn, Referral"
                  value={formData.source}
                  onChange={(e) => handleFormChange('source', e.target.value)}
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
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="follow-up">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4" /> Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Initial notes about the lead..."
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelAdd}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleAddLead} className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Save className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lead Details View */}
      {showDetailsView && selectedLead && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <div className="mb-6">
              <span className="text-xl font-bold text-white">Lead Details</span>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4" /> Lead Name
                  </Label>
                  <div className="text-white font-medium">{detailsFormData.leadName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4" /> Company
                  </Label>
                  <div className="text-white font-medium">{detailsFormData.company}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4" /> Contact
                  </Label>
                  <div className="text-white font-medium">{detailsFormData.contact}</div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <div className="text-white font-medium">{detailsFormData.email}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-300">
                  <ArrowRightCircle className="w-4 h-4" /> Source
                </Label>
                <div className="text-white font-medium">{detailsFormData.source}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <div>{getStatusBadge(detailsFormData.status)}</div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4" /> Notes
                </Label>
                <div className="text-white font-medium">{detailsFormData.notes || 'No notes available'}</div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelDetails}>
                  <X className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => {
                  setShowDetailsView(false);
                  setShowEditView(true);
                  setIsEditingDetails(true);
                }} className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Lead
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Lead View */}
      {showEditView && selectedLead && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <div className="mb-6">
              <span className="text-xl font-bold text-white">Edit Lead</span>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-leadName" className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4" /> Lead Name *
                  </Label>
                  <Input
                    id="edit-leadName"
                    placeholder="Jane Doe"
                    value={detailsFormData.leadName || ''}
                    onChange={(e) => handleDetailsFormChange('leadName', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company" className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4" /> Company *
                  </Label>
                  <Input
                    id="edit-company"
                    placeholder="Innovate Corp."
                    value={detailsFormData.company || ''}
                    onChange={(e) => handleDetailsFormChange('company', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact" className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4" /> Contact
                  </Label>
                  <Input
                    id="edit-contact"
                    placeholder="+1 555-987-6543"
                    value={detailsFormData.contact || ''}
                    onChange={(e) => handleDetailsFormChange('contact', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4" /> Email *
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="jane.doe@example.com"
                    value={detailsFormData.email || ''}
                    onChange={(e) => handleDetailsFormChange('email', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-source" className="flex items-center gap-2 text-slate-300">
                  <ArrowRightCircle className="w-4 h-4" /> Source
                </Label>
                <Input
                  id="edit-source"
                  placeholder="e.g., Website, LinkedIn, Referral"
                  value={detailsFormData.source || ''}
                  onChange={(e) => handleDetailsFormChange('source', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select
                  value={detailsFormData.status || 'not-started'}
                  onValueChange={(value) => handleDetailsFormChange('status', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="follow-up">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4" /> Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Initial notes about the lead..."
                  value={detailsFormData.notes || ''}
                  onChange={(e) => handleDetailsFormChange('notes', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelDetails}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveDetails} className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Virtual Call Dialog */}
      {showCallView && selectedLead && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Virtual Call</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancelCall}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              {/* Contact Avatar */}
              <div className="w-20 h-20 bg-purple-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {selectedLead.leadName?.charAt(0) || 'A'}
                </span>
              </div>
              
              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold text-white">{selectedLead.leadName}</h3>
                <p className="text-slate-400">{selectedLead.company}</p>
              </div>
              
              {/* Call Details */}
              <div className="space-y-2">
                <p className="text-slate-300">Ready to call?</p>
                <p className="text-slate-400 text-sm">Virtual Number: +1-555-CRM-PRO</p>
              </div>
              
              {/* Call Button */}
              <Button 
                onClick={handleSaveCall} 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {selectedLead.contact || '+1 (555) 111-2222'}
              </Button>
              
              {/* Manual Log Option */}
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowCallView(false);
                  // Open manual call log form
                  setCallFormData({
                    date: new Date().toISOString().split('T')[0],
                    notes: '',
                    nextFollowUp: '',
                    status: selectedLead.status
                  });
                  setShowCallView(true);
                }}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Log call details manually
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter - Only show when not in any form mode */}
      {!showAddForm && !showDetailsView && !showCallView && !showEditView && (
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
      )}

      {/* Desktop Table View - Only show when not in any form mode */}
      {!showAddForm && !showDetailsView && !showCallView && !showEditView && (
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
      )}

      {/* Mobile Card View - Only show when not in any form mode */}
      {!showAddForm && !showDetailsView && !showCallView && !showEditView && (
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
      )}

      {!showAddForm && !showDetailsView && !showCallView && !showEditView && filteredLeads.length === 0 && (
        <div className="text-center py-8"><p className="text-slate-400">No leads found</p></div>
      )}

      <ImportLeadsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImportLeads} roundRobinEnabled={settings.roundRobin} />
      {canManageLeads && <AssignLeadsModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onAssign={handleManualAssign} />}
    </motion.div>
  );
};

export default LeadsTable;
