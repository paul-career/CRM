import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Menu, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { sampleClients, sampleLeads } from '@/data/sampleData';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import LeadStatusChart from '@/components/Dashboard/LeadStatusChart';
import AccountsPage from '@/components/Accounts/AccountsPage';
import LeadsTable from '@/components/Leads/LeadsTable';
import FinancePage from '@/components/Finance/FinancePage';
import ReportsPage from '@/components/Reports/ReportsPage';
import UserManagementPage from '@/components/UserManagement/UserManagementPage';
import SettingsPage from '@/components/Settings/SettingsPage';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [accounts, setAccounts] = useLocalStorage('crmAccounts', sampleClients || []);
  const [leads, setLeads] = useLocalStorage('crmLeads', sampleLeads || []);
  const [meetings, setMeetings] = useLocalStorage('crmMeetings', []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to move completed leads to meetings
  const handleLeadStatusChange = (leadId, newStatus) => {
    if (newStatus === 'completed') {
      // Find the lead to move
      const leadToMove = leads.find(lead => lead.id === leadId);
      if (leadToMove) {
        // Add to meetings with completion date
        const completedLead = {
          ...leadToMove,
          completedAt: new Date().toISOString(),
          status: 'completed'
        };
        setMeetings(prev => [completedLead, ...prev]);
        
        // Remove from leads
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
      }
    } else {
      // For other status changes, just update the lead
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    }
  };

  // Function to reopen a meeting (move back to leads)
  const handleReopenMeeting = (meetingId) => {
    const meetingToReopen = meetings.find(meeting => meeting.id === meetingId);
    if (meetingToReopen) {
      // Remove completedAt and change status to in-progress
      const reopenedLead = {
        ...meetingToReopen,
        status: 'in-progress',
        completedAt: undefined
      };
      delete reopenedLead.completedAt;
      
      // Add back to leads
      setLeads(prev => [reopenedLead, ...prev]);
      
      // Remove from meetings
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      
      // Show success message
      toast({
        title: "Meeting reopened successfully!",
        description: `${meetingToReopen.leadName} has been moved back to leads.`
      });
    }
  };

  // Handle URL parameters for navigation
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['dashboard', 'accounts', 'leads', 'meeting', 'finance', 'reports', 'user-management', 'settings'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Debug logging
  console.log('DashboardPage rendered:', { 
    user: user ? { name: user.name, role: user.role } : null, 
    accounts: accounts?.length || 0, 
    leads: leads?.length || 0, 
    activeSection,
    hasPermission: typeof hasPermission,
    isSidebarOpen
  });

  const renderContent = () => {
    const unauthorizedAccess = (
      <div className="text-center py-12">
        <p className="text-slate-400">You don't have permission to access this section.</p>
      </div>
    );

    switch (activeSection) {
      case 'accounts':
        return hasPermission('accounts') ? <AccountsPage accounts={accounts} setAccounts={setAccounts} /> : unauthorizedAccess;
      
      case 'leads':
        return hasPermission('leads') ? <LeadsTable leads={leads} setLeads={setLeads} onLeadStatusChange={handleLeadStatusChange} /> : unauthorizedAccess;
      
      case 'meeting':
        return hasPermission('meeting') ? (
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Completed leads and meetings</h2>
            
            {meetings.length > 0 ? (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">{meeting.leadName}</h3>
                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-1">{meeting.company}</p>
                      <p className="text-slate-400 text-xs mb-2">{meeting.contact}</p>
                      <p className="text-slate-400 text-xs mb-3">
                        Completed: {new Date(meeting.completedAt).toLocaleDateString()}
                      </p>
                      <Button
                        onClick={() => handleReopenMeeting(meeting.id)}
                        variant="outline"
                        size="sm"
                        className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reopen
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                <p className="text-slate-300">No completed leads yet. Complete some leads to see them here.</p>
              </div>
            )}
          </div>
        ) : unauthorizedAccess;
      
      case 'finance':
        return hasPermission('finance') ? <FinancePage leads={leads} /> : unauthorizedAccess;

      case 'reports':
        return hasPermission('reports') ? <ReportsPage leads={leads} clients={accounts} /> : unauthorizedAccess;

      case 'user-management':
        return hasPermission('user-management') ? <UserManagementPage /> : unauthorizedAccess;
        
      case 'settings':
        return hasPermission('settings') ? <SettingsPage /> : unauthorizedAccess;
        
      default:
        return (
          <div className="space-y-8">
            {/* Simple test content first */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Dashboard Test</h2>
              <p className="text-slate-400">If you can see this, the basic dashboard is working.</p>
              <p className="text-slate-400 mt-2">Clients: {accounts?.length || 0}</p>
              <p className="text-slate-400">Leads: {leads?.length || 0}</p>
            </div>
            
            {/* Original dashboard components */}
            <DashboardStats clients={accounts} leads={leads} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivity leads={leads} />
              <LeadStatusChart leads={leads} />
            </div>
          </div>
        );
    }
  };

  const getPageTitleAndDescription = () => {
    switch (activeSection) {
      case 'accounts':
        return { title: 'Clients - Call 360', description: 'Manage your clients and customer relationships.' };
      case 'leads':
        return { title: 'Leads - Call 360', description: 'Track and manage sales leads.' };
      case 'meeting':
        return { title: 'Meeting Fixed - Call 360', description: 'Manage your meetings and appointments.' };
      case 'finance':
        return { title: 'Finance - Call 360', description: 'View financial data and reports.' };
      case 'reports':
        return { title: 'Reports - Call 360', description: 'Generate and view detailed reports.' };
      case 'user-management':
        return { title: 'User Management - Call 360', description: 'Manage users and their roles.' };
      case 'settings':
        return { title: 'Settings - Call 360', description: 'Configure application settings.' };
      default:
        return { title: 'Dashboard - Call 360', description: 'Call 360 dashboard with key statistics.' };
    }
  };

  const { title, description } = getPageTitleAndDescription();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Helmet>

      <div className="flex min-h-screen bg-slate-900">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-auto lg:ml-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                   <Button variant="ghost" size="icon" className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(true)}>
                     <Menu className="w-6 h-6" />
                   </Button>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold text-white capitalize">
                      {activeSection === 'dashboard' ? `Welcome, ${user?.name || 'User'}` : 
                       activeSection === 'accounts' ? 'Clients' : 
                       activeSection === 'meeting' ? 'Meeting Fixed' : activeSection.replace('-', ' ')}
                    </span>
                    <p className="text-slate-400 mt-1 text-sm sm:text-base">
                      {activeSection === 'dashboard' 
                        ? 'Here\'s what\'s happening today.'
                        : activeSection === 'accounts' 
                        ? 'Manage your clients and customer relationships.'
                        : `Manage your ${activeSection.replace('-', ' ')}.`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="text-right bg-slate-800/50 p-2 px-4 rounded-lg self-end sm:self-center">
                  <p className="text-slate-400 text-xs">Role</p>
                  <p className="text-white font-medium capitalize">{user?.role || 'User'}</p>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
