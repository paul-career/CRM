import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
    const [role, setRole] = useState(user?.role || 'user');

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    const handleSave = () => {
        onSave(user.id, { role });
        onClose();
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Edit User Role
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 py-4"
                >
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-slate-300">
                            <User className="w-4 h-4" /> Name
                        </Label>
                        <p className="text-white p-2 bg-slate-800/50 rounded-md">{user.name}</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-4 h-4" /> Email Address
                        </Label>
                        <p className="text-white p-2 bg-slate-800/50 rounded-md">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-slate-300">
                            <Shield className="w-4 h-4" /> Role
                        </Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
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
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;