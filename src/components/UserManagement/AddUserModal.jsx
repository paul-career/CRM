import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required.";
        if (!formData.email) {
            tempErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is invalid.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onAdd(formData);
            onClose();
            setFormData({ name: '', email: '', role: 'user' });
            setErrors({});
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Add New User
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 py-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-slate-300">
                            <User className="w-4 h-4" /> Full Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-4 h-4" /> Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-slate-300">
                            <Shield className="w-4 h-4" /> Role
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => handleChange('role', value)}
                        >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-600">
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="lead">Lead</SelectItem>
                                    <SelectItem value="super-admin">Super Admin</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm text-slate-400 p-3 bg-slate-800/50 rounded-lg">
                        An email will be sent to the user with a temporary password and login instructions.
                    </div>
                </motion.div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-blue-500">
                        <Save className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserModal;
