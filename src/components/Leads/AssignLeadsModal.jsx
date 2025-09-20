import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';

const AssignLeadsModal = ({ isOpen, onClose, onAssign }) => {
    const { getAssignableUsers } = useAuth();
    const [selectedUser, setSelectedUser] = useState('');
    const assignableUsers = getAssignableUsers();

    const handleAssign = () => {
        if (selectedUser) {
            onAssign(selectedUser);
            onClose();
            setSelectedUser('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        Assign Leads
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 py-4"
                >
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-slate-300">
                            Assign to User
                        </Label>
                        <Select
                            value={selectedUser}
                            onValueChange={setSelectedUser}
                        >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                                <SelectValue placeholder="Select a user to assign..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                {assignableUsers.map(user => (
                                    <SelectItem key={user.id} value={user.email}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleAssign} disabled={!selectedUser} className="bg-gradient-to-r from-green-500 to-blue-500">
                        <Save className="w-4 h-4 mr-2" />
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AssignLeadsModal;