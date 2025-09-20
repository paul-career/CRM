import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Phone, Mail, MapPin, Save, X, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AccountDetailsModal = ({ isOpen, onClose, account, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const generateAvatarUrl = (seed) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;

  useEffect(() => {
    if (account) {
      setFormData(account);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [account]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
             <Avatar>
                <AvatarImage src={generateAvatarUrl(formData.name)} alt={formData.name} />
                <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            Account Details
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4" /> Player Name
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              readOnly={!isEditing}
              className="bg-slate-800/50 border-slate-600 text-white read-only:bg-slate-800/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4" /> Guild
            </Label>
            <Input
              id="company"
              value={formData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              readOnly={!isEditing}
              className="bg-slate-800/50 border-slate-600 text-white read-only:bg-slate-800/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact" className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4" /> Contact / Discord
            </Label>
            <Input
              id="contact"
              value={formData.contact || ''}
              onChange={(e) => handleChange('contact', e.target.value)}
              readOnly={!isEditing}
              className="bg-slate-800/50 border-slate-600 text-white read-only:bg-slate-800/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              readOnly={!isEditing}
              className="bg-slate-800/50 border-slate-600 text-white read-only:bg-slate-800/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4" /> Server / Region
            </Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              readOnly={!isEditing}
              className="bg-slate-800/50 border-slate-600 text-white read-only:bg-slate-800/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select
              value={formData.status || 'active'}
              onValueChange={(value) => handleChange('status', value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white disabled:bg-slate-800/30 disabled:opacity-100">
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
            Close
          </Button>
          {isEditing ? (
            <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-blue-500">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsModal;
