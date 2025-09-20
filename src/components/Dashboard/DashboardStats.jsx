import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Phone, TrendingUp } from 'lucide-react';

const DashboardStats = ({ clients, leads }) => {
  const stats = [
    {
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Active Leads',
      value: leads.filter(lead => lead.status !== 'completed').length,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      change: '+8%'
    },
    {
      title: 'Calls Made',
      value: leads.reduce((total, lead) => total + lead.callHistory.length, 0),
      icon: Phone,
      color: 'from-green-500 to-emerald-500',
      change: '+15%'
    },
    {
      title: 'Conversion Rate',
      value: `${Math.round((leads.filter(lead => lead.status === 'completed').length / leads.length) * 100)}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      change: '+5%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.title}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
