import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Building, Phone, Mail, FileText, Calendar, Zap, MessageSquare, Clock, ArrowRightCircle, Edit } from 'lucide-react';

const TimelineItem = ({ icon, color, title, description, date, index }) => {
    const IconComponent = icon;
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 relative"
        >
            <div className="absolute left-[18px] top-12 bottom-0 w-0.5 bg-slate-700" />
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} z-10`}>
                    <IconComponent className="w-5 h-5 text-white" />
                </div>
            </div>
            <div className="pb-8 flex-1">
                <p className="font-semibold text-white">{title}</p>
                {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
                <p className="text-xs text-slate-500 mt-2">{new Date(date).toLocaleString()}</p>
            </div>
        </motion.div>
    );
};

const getEventDetails = (event) => {
    switch (event.type) {
        case 'call':
            return {
                icon: Phone,
                color: 'bg-green-500',
                title: 'Call Logged',
                description: event.notes
            };
        case 'follow-up':
            return {
                icon: Clock,
                color: 'bg-yellow-500',
                title: 'Follow-up Scheduled',
                description: `Next follow-up on ${event.nextFollowUp}`
            };
        case 'edit':
             return {
                icon: Edit,
                color: 'bg-orange-500',
                title: 'Lead Edited',
                description: event.notes
            };
        default:
            return {
                icon: MessageSquare,
                color: 'bg-gray-500',
                title: 'Event',
                description: event.notes
            };
    }
}

const LeadDetailsModal = ({ isOpen, onClose, lead }) => {
    if (!lead) return null;

    const getTimelineEvents = () => {
        let events = [];
        // Lead Creation
        events.push({
            type: 'creation',
            icon: Zap,
            color: 'bg-purple-500',
            title: 'Lead Created',
            description: `Lead added from source: ${lead.source}`,
            date: lead.createdAt
        });

        // Call History & Other Events
        if(lead.callHistory) {
            lead.callHistory.forEach(event => {
                const details = getEventDetails(event);
                events.push({
                    ...details,
                    date: event.date,
                });

                if (event.type === 'call' && event.nextFollowUp) {
                    events.push({
                       ...getEventDetails({type: 'follow-up', nextFollowUp: event.nextFollowUp}),
                       date: event.date
                    });
                }
            });
        }
        
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        return events;
    };
    
    const timelineEvents = getTimelineEvents();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Lead Details
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    {/* Left Panel: Lead Info */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-lg font-semibold text-white mb-4">Lead Information</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-white">{lead.leadName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building className="w-4 h-4 text-slate-400" />
                                <span className="text-white">{lead.company}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-white">{lead.contact}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-white">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ArrowRightCircle className="w-4 h-4 text-slate-400" />
                                <span className="text-white">Assigned to: {lead.assignedTo}</span>
                            </div>
                            <div className="pt-4">
                                <h4 className="font-semibold text-slate-300 mb-2">Initial Note</h4>
                                <p className="text-slate-400 p-3 bg-slate-800/50 rounded-md italic">
                                    {lead.notes || 'No initial notes for this lead.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Panel: Timeline */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-lg font-semibold text-white mb-4">Lead History</h3>
                        <div className="relative max-h-96 overflow-y-auto pr-2">
                             {timelineEvents.map((event, index) => (
                                <TimelineItem key={index} {...event} index={index}/>
                             ))}
                        </div>
                    </motion.div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsModal;