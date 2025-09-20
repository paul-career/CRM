import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Phone, Mail, ArrowRightCircle, FileText, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const EditLeadModal = ({ isOpen, onClose, lead, onSave }) => {
    const [formData, setFormData] = useState({
        leadName: '',
        company: '',
        contact: '',
        email: '',
        source: '',
        notes: ''
    });
    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        if (lead) {
            const initialData = {
                leadName: lead.leadName || '',
                company: lead.company || '',
                contact: lead.contact || '',
                email: lead.email || '',
                source: lead.source || '',
                notes: lead.notes || ''
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [lead]);

    const handleSave = () => {
        const changes = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== originalData[key]) {
                acc.push(`${key.charAt(0).toUpperCase() + key.slice(1)} changed to "${formData[key]}"`);
            }
            return acc;
        }, []);

        const historyLog = {
            id: Date.now(),
            type: 'edit',
            notes: `Lead details updated. ${changes.join('. ')}`,
            date: new Date().toISOString()
        };
        
        onSave(lead.id, formData, historyLog);
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!lead) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Edit Lead Details
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 py-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="leadName" className="flex items-center gap-2 text-slate-300"><User className="w-4 h-4" /> Lead Name</Label>
                            <Input id="leadName" value={formData.leadName} onChange={(e) => handleChange('leadName', e.target.value)} className="bg-slate-800/50 border-slate-600" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company" className="flex items-center gap-2 text-slate-300"><Building className="w-4 h-4" /> Company</Label>
                            <Input id="company" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} className="bg-slate-800/50 border-slate-600" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact" className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4" /> Contact</Label>
                            <Input id="contact" value={formData.contact} onChange={(e) => handleChange('contact', e.target.value)} className="bg-slate-800/50 border-slate-600" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4" /> Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="bg-slate-800/50 border-slate-600" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="source" className="flex items-center gap-2 text-slate-300"><ArrowRightCircle className="w-4 h-4" /> Source</Label>
                        <Input id="source" value={formData.source} onChange={(e) => handleChange('source', e.target.value)} className="bg-slate-800/50 border-slate-600" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="flex items-center gap-2 text-slate-300"><FileText className="w-4 h-4" /> Notes</Label>
                        <Textarea id="notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className="bg-slate-800/50 border-slate-600" />
                    </div>
                </motion.div>

                <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}><X className="w-4 h-4 mr-2" />Cancel</Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-blue-500"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditLeadModal;