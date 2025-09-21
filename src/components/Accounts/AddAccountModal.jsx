import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Phone, Mail, MapPin, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddAccountModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    email: '',
    location: '',
    status: 'pending'
  });

  const handleSave = () => {
    const newAccount = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    onAdd(newAccount);
    onClose();
    setFormData({
      name: '',
      company: '',
      contact: '',
      email: '',
      location: '',
      status: 'pending'
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
            Add New Client
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4" /> Client Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4" /> Company
              </Label>
              <Input
                id="company"
                placeholder="Acme Corp"
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
                <Phone className="w-4 h-4" /> Phone
              </Label>
              <Input
                id="contact"
                placeholder="+1 (555) 123-4567"
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
                placeholder="client@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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
              onChange={(e) => handleChange('location', e.target.value)}
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-blue-500">
            <Save className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
