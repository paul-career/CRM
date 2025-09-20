import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AccountsTable = ({ accounts, onEdit, onView, onDelete }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedAccounts = [...accounts].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-badge status-active',
      inactive: 'status-badge status-inactive',
      pending: 'status-badge status-pending'
    };
    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const generateAvatarUrl = (seed) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <TableHead className="text-slate-300 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
              Player Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-slate-300 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('company')}>
              Guild {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-slate-300">Contact</TableHead>
            <TableHead className="text-slate-300 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('location')}>
              Server/Region {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAccounts.map((account, index) => (
            <motion.tr
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-slate-700 hover:bg-slate-800/30 transition-colors"
            >
              <TableCell className="text-white font-medium flex items-center gap-3">
                 <Avatar>
                    <AvatarImage src={generateAvatarUrl(account.name)} alt={account.name} />
                    <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {account.name}
              </TableCell>
              <TableCell className="text-slate-300">{account.company}</TableCell>
              <TableCell className="text-slate-300">{account.contact}</TableCell>
              <TableCell className="text-slate-300">{account.location}</TableCell>
              <TableCell>{getStatusBadge(account.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => onView(account)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onEdit(account)} className="text-green-400 hover:text-green-300 hover:bg-green-500/20">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(account.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      {sortedAccounts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No accounts found</p>
        </div>
      )}
    </div>
  );
};

export default AccountsTable;