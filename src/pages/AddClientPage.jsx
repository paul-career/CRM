import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Phone, Mail, MapPin, Save, ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { sampleClients } from '@/data/sampleData';
import Sidebar from '@/components/Layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const AddClientPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [accounts, setAccounts] = useLocalStorage('crmAccounts', sampleClients || []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarNavigation = (section) => {
    navigate(`/dashboard?section=${section}`);
  };
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    email: '',
    location: '',
    status: 'pending'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.company || !formData.email) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newClient = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccounts([newClient, ...accounts]);
    toast({ 
      title: "Client added successfully",
      description: `${formData.name} has been added to your clients.`
    });
    
    navigate('/dashboard?section=accounts');
  };

  const handleCancel = () => {
    navigate('/dashboard?section=accounts');
  };

  return (
    <>
      <Helmet>
        <title>Add New Client - CRM</title>
        <meta name="description" content="Add a new client to your CRM system." />
      </Helmet>

      <div className="flex min-h-screen bg-slate-900">
        <Sidebar 
          activeSection="accounts" 
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
                  <div>
                    <h1 className="text-3xl font-bold text-white">Add New Client</h1>
                    <p className="text-slate-400 mt-1">Create a new client record in your CRM system</p>
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
                      <Label htmlFor="name" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <User className="w-4 h-4" /> Client Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Shield className="w-4 h-4" /> Company *
                      </Label>
                      <Input
                        id="company"
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Phone className="w-4 h-4" /> Phone
                      </Label>
                      <Input
                        id="contact"
                        placeholder="+1 (555) 123-4567"
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
                        placeholder="client@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <MapPin className="w-4 h-4" /> Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="New York, USA"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Client
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

export default AddClientPage;
