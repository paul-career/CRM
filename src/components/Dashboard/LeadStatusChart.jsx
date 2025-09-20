import React from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

const LeadStatusChart = ({ leads }) => {
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    { status: 'not-started', label: 'Not Started', color: 'bg-gray-500', count: statusCounts['not-started'] || 0 },
    { status: 'in-progress', label: 'In Progress', color: 'bg-blue-500', count: statusCounts['in-progress'] || 0 },
    { status: 'completed', label: 'Completed', color: 'bg-green-500', count: statusCounts['completed'] || 0 },
    { status: 'follow-up', label: 'Follow Up', color: 'bg-yellow-500', count: statusCounts['follow-up'] || 0 }
  ];

  const total = leads.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <PieChart className="w-6 h-6 text-purple-400" />
        <span className="text-xl font-semibold text-white">Lead Status Overview</span>
      </div>

      <div className="space-y-4">
        {statusData.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          
          return (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                <span className="text-slate-300">{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
                <span className="text-white font-medium w-12 text-right">{item.count}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LeadStatusChart;