import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Phone, User, Target } from 'lucide-react';

const RecentActivity = ({ leads }) => {
  const recentActivities = leads
    .flatMap(lead => 
      lead.callHistory.map(call => ({
        id: `${lead.id}-${call.id}`,
        type: 'call',
        leadName: lead.leadName,
        date: call.date,
        notes: call.notes,
        icon: Phone
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-400" />
        <span className="text-xl font-semibold text-white">Recent Activity</span>
      </div>

      <div className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">Call with {activity.leadName}</p>
                  <p className="text-slate-400 text-sm truncate">{activity.notes}</p>
                  <p className="text-slate-500 text-xs mt-1">{activity.date}</p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;