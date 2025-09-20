import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Phone, Mail, ArrowRightCircle, FileText, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const AddLeadModal = ({ isOpen, onClose, onAdd }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    contact: '',
    email: '',
    source: '',
    status: 'not-started',
    notes: ''
  });

  const handleSave = () => {
    const newLead = {
      ...formData,
      id: Date.now(),
      assignedTo: user.email,
      createdAt: new Date().toISOString(),
      callHistory: []
    };
    onAdd(newLead);
    onClose();
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Add New Lead
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leadName" className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4" /> Lead Name
              </Label>
              <Input
                id="leadName"
                placeholder="Jane Doe"
                value={formData.leadName}
                onChange={(e) => handleChange('leadName', e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2 text-slate-300">
                <Building className="w-4 h-4" /> Company
              </Label>
              <Input
                id="company"
                placeholder="Innovate Corp."
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
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
                onChange={(e) => handleChange('contact', e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane.doe@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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
              onChange={(e) => handleChange('source', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
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
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
        </motion.div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-blue-500">
            <Save className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
