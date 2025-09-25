import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { User, Building, Phone, Mail, ArrowRightCircle, FileText, Save, ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { sampleLeads } from '@/data/sampleData';
import Sidebar from '@/components/Layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const AddLeadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [leads, setLeads] = useLocalStorage('crmLeads', sampleLeads || []);
  
  // Migration: Convert old leads with 'source' field to 'date' field
  useEffect(() => {
    const needsMigration = leads.some(lead => lead.source && !lead.date);
    if (needsMigration) {
      const migratedLeads = leads.map(lead => {
        if (lead.source && !lead.date) {
          // Generate a random date for existing leads
          const randomDates = ['2024-12-15', '2024-11-28', '2024-10-22', '2024-09-14', '2024-08-07'];
          const randomDate = randomDates[Math.floor(Math.random() * randomDates.length)];
          return { ...lead, date: randomDate, source: undefined };
        }
        return lead;
      });
      setLeads(migratedLeads);
    }
  }, [leads, setLeads]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarNavigation = (section) => {
    navigate(`/dashboard?section=${section}`);
  };
  
  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    contact: '',
    email: '',
    source: '',
    status: 'not-started',
    notes: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
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
    toast({ 
      title: "Lead added successfully",
      description: `${formData.leadName} has been added to your leads.`
    });
    
    navigate('/dashboard?section=leads');
  };

  const handleCancel = () => {
    navigate('/dashboard?section=leads');
  };

  return (
    <>
      <Helmet>
        <title>Add New Lead - CRM</title>
        <meta name="description" content="Add a new lead to your CRM system." />
      </Helmet>

      <div className="flex min-h-screen bg-slate-900">
        <Sidebar 
          activeSection="leads" 
          setActiveSection={handleSidebarNavigation} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
        
        <main className="flex-1 overflow-auto lg:ml-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-400"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">Add New Lead</h1>
                      <p className="text-slate-400 mt-1">Create a new lead record in your CRM system</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-effect rounded-2xl p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="leadName" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <User className="w-4 h-4" /> Lead Name *
                      </Label>
                      <Input
                        id="leadName"
                        placeholder="Jane Doe"
                        value={formData.leadName}
                        onChange={(e) => handleChange('leadName', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Building className="w-4 h-4" /> Company *
                      </Label>
                      <Input
                        id="company"
                        placeholder="Innovate Corp."
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Phone className="w-4 h-4" /> Contact
                      </Label>
                      <Input
                        id="contact"
                        placeholder="+1 555-987-6543"
                        value={formData.contact}
                        onChange={(e) => handleChange('contact', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Mail className="w-4 h-4" /> Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane.doe@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <ArrowRightCircle className="w-4 h-4" /> Source
                      </Label>
                      <Input
                        id="source"
                        placeholder="e.g., Website, LinkedIn, Referral"
                        value={formData.source}
                        onChange={(e) => handleChange('source', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300 text-sm font-medium">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleChange('status', value)}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-12">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="follow-up">Follow Up</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notes Section - Full Width */}
                <div className="mt-8 space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <FileText className="w-4 h-4" /> Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Initial notes about the lead..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-700">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="px-8 py-3 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AddLeadPage;
