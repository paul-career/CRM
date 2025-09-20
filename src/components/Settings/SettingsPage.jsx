import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, SlidersHorizontal } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
    const [settings, setSettings] = useLocalStorage('crmSettings', {
        roundRobin: true,
    });
    const { toast } = useToast();

    const handleSettingChange = (key, value) => {
        const boolValue = value === 'true';
        setSettings(prev => ({...prev, [key]: boolValue}));
        toast({
            title: "Settings updated",
            description: `Round-Robin Assignment has been set to ${boolValue ? 'Yes' : 'No'}.`
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <SlidersHorizontal className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Lead Settings</h2>
                        <p className="text-slate-400">Manage how leads are handled in the system.</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Repeat className="w-5 h-5 text-blue-400"/>
                            <div>
                                <Label htmlFor="round-robin" className="font-semibold text-white text-base">Round-Robin Assignment</Label>
                                <p className="text-sm text-slate-400">Automatically distribute imported leads among users.</p>
                            </div>
                        </div>
                        <Select
                            value={settings.roundRobin.toString()}
                            onValueChange={(value) => handleSettingChange('roundRobin', value)}
                        >
                            <SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            
            {/* Placeholder for more settings */}
            <div className="glass-effect rounded-xl p-6 opacity-50">
                 <h2 className="text-xl font-bold text-white mb-2">Notification Settings</h2>
                 <p className="text-slate-400">More settings coming soon...</p>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
