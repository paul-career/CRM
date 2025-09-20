import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Eye, Trash2, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const KanbanColumn = ({ title, accounts, onEdit, onView, onDelete, color }) => {
    const generateAvatarUrl = (seed) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
    return (
        <div className="flex-1 min-w-[300px] bg-slate-800/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="font-semibold text-white">{title}</span>
                <span className="text-sm text-slate-400 bg-slate-700/50 rounded-full px-2 py-0.5">
                    {accounts.length}
                </span>
            </div>
            <div className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {accounts.map((account, index) => (
                <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-effect p-4 rounded-lg"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={generateAvatarUrl(account.name)} alt={account.name} />
                                <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-white">{account.name}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3 text-yellow-500" /> {account.company}</p>
                            </div>
                        </div>
                    </div>
                    {account.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 pl-12">
                            <MapPin className="w-3 h-3" />
                            <span>{account.location}</span>
                        </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-end gap-2">
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
                </motion.div>
                ))}
                {accounts.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <p>No accounts in this stage.</p>
                </div>
                )}
            </div>
        </div>
    );
};

const AccountsKanban = ({ accounts, onEdit, onView, onDelete }) => {
  const columns = {
    pending: {
      title: 'Pending',
      accounts: accounts.filter(c => c.status === 'pending'),
      color: 'bg-yellow-500'
    },
    active: {
      title: 'Active',
      accounts: accounts.filter(c => c.status === 'active'),
      color: 'bg-green-500'
    },
    inactive: {
      title: 'Inactive',
      accounts: accounts.filter(c => c.status === 'inactive'),
      color: 'bg-red-500'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-6 overflow-x-auto pb-4"
    >
      {Object.values(columns).map(col => (
        <KanbanColumn
          key={col.title}
          title={col.title}
          accounts={col.accounts}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          color={col.color}
        />
      ))}
    </motion.div>
  );
};

export default AccountsKanban;