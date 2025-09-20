import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Mail, Shield, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

const UserManagementPage = () => {
    const { user: currentUser, users, addUser, updateUser, deleteUser } = useAuth();
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { toast } = useToast();

    const handleAddUser = (newUser) => {
        const tempPassword = Math.random().toString(36).slice(-8);
        addUser({ ...newUser, id: Date.now(), password: tempPassword });

        toast({
            title: "User Added Successfully!",
            description: `An email would be sent to ${newUser.email} with a temporary password.`,
        });
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
                <div>
                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                    <p className="text-slate-400 mt-1">Manage system users and their roles</p>
                </div>
                <Button onClick={() => setIsAddUserModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

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

            <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onAdd={handleAddUser} />
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