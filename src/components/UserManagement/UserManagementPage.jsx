import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Mail, Shield, MoreVertical, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EditUserModal from './EditUserModal';

const UserManagementPage = () => {
    const { user: currentUser, users, addUser, updateUser, deleteUser } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});
    const { toast } = useToast();

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

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAddUser = () => {
        if (validate()) {
            const tempPassword = Math.random().toString(36).slice(-8);
            addUser({ ...formData, id: Date.now(), password: tempPassword });

            toast({
                title: "User Added Successfully!",
                description: `An email would be sent to ${formData.email} with a temporary password.`,
            });

            // Reset form and close
            setFormData({ name: '', email: '', role: 'user' });
            setErrors({});
            setShowAddForm(false);
        }
    };

    const handleCancelAdd = () => {
        setFormData({ name: '', email: '', role: 'user' });
        setErrors({});
        setShowAddForm(false);
    };

    const handleEditUser = (userId, updatedData) => {
        updateUser(userId, updatedData);
        toast({ title: "User Updated Successfully!" });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditUserModalOpen(true);
    };

    const openDeleteAlert = (user) => {
        if (user.id === currentUser.id) {
            toast({ title: "Action not allowed", description: "You cannot delete your own account.", variant: "destructive" });
            return;
        }
        setSelectedUser(user);
        setIsDeleteAlertOpen(true);
    };

    const handleDeleteUser = () => {
        deleteUser(selectedUser.id);
        toast({ title: "User Deleted Successfully!" });
        setIsDeleteAlertOpen(false);
        setSelectedUser(null);
    };

    const getRoleBadge = (role) => {
        const roleClasses = {
          admin: 'status-badge status-destructive',
          sales: 'status-badge status-in-progress',
          user: 'status-badge status-pending'
        };
        return (
          <span className={`${roleClasses[role] || 'status-badge'} flex items-center gap-1.5`}>
            <Shield className="w-3 h-3"/>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {showAddForm && (
                        <Button
                            variant="ghost"
                            onClick={handleCancelAdd}
                            className="text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {showAddForm ? 'Add New User' : 'User Management'}
                        </h2>
                        <p className="text-slate-400 mt-1">
                            {showAddForm ? 'Create a new user account' : 'Manage system users and their roles'}
                        </p>
                    </div>
                </div>
                {!showAddForm && (
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add User
                    </Button>
                )}
            </div>

            {/* Add User Form - Only show when showAddForm is true */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Add New User</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2 text-slate-300">
                                <User className="w-4 h-4" /> Full Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
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
                                onChange={(e) => handleFormChange('email', e.target.value)}
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
                                onValueChange={(value) => handleFormChange('role', value)}
                            >
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

                        <div className="text-sm text-slate-400 p-3 bg-slate-800/50 rounded-lg">
                            An email will be sent to the user with a temporary password and login instructions.
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={handleCancelAdd}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleAddUser} className="bg-gradient-to-r from-green-500 to-blue-500">
                                <Save className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* User Table - Only show when not in add form mode */}
            {!showAddForm && (
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                            <TableHead className="text-slate-300">Name</TableHead>
                            <TableHead className="text-slate-300">Email</TableHead>
                            <TableHead className="text-slate-300">Role</TableHead>
                            <TableHead className="text-slate-300 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-slate-700"
                            >
                                <TableCell className="text-white font-medium flex items-center gap-2"><User className="w-4 h-4 text-slate-400" />{user.name}</TableCell>
                                <TableCell className="text-slate-300 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" />{user.email}</TableCell>
                                <TableCell>{getRoleBadge(user.role)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                                            <DropdownMenuItem onClick={() => openEditModal(user)}><Edit className="mr-2 h-4 w-4" /> Edit Role</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openDeleteAlert(user)} className="text-red-400 focus:text-red-400 focus:bg-red-500/20"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
                </div>
            )}
            {selectedUser && <EditUserModal isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} user={selectedUser} onSave={handleEditUser} />}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account for <span className="font-bold text-white">{selectedUser?.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};

export default UserManagementPage;
