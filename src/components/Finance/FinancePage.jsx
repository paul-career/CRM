import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Banknote, Landmark, Wifi } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FinancePage = ({ leads }) => {
    const { toast } = useToast();
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const completedLeads = leads.filter(lead => lead.status === 'completed');
    const selectedLead = completedLeads.find(lead => lead.id.toString() === selectedLeadId);

    const handlePayment = () => {
        if (!selectedLeadId || !amount) {
            toast({
                title: "Incomplete Information",
                description: "Please select a lead and enter an amount.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "🚧 Payment Simulation",
            description: `A payment of $${amount} for lead "${selectedLead.leadName}" via ${paymentMethod} would be processed. This is a UI demonstration.`,
        });

        setSelectedLeadId('');
        setAmount('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Process Payment</h2>
                        <p className="text-slate-400">Collect payments for completed leads.</p>
                    </div>
                </div>

                <div className="max-w-lg mx-auto space-y-6">
                    <div>
                        <Label htmlFor="lead-select" className="text-slate-300 mb-2 block">Select a Completed Lead</Label>
                        <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                            <SelectTrigger id="lead-select" className="bg-slate-800/50 border-slate-600">
                                <SelectValue placeholder="Select a lead..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                {completedLeads.length > 0 ? (
                                    completedLeads.map(lead => (
                                        <SelectItem key={lead.id} value={lead.id.toString()}>
                                            {lead.leadName} ({lead.company})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-400">No completed leads available.</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedLeadId && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <Label htmlFor="amount" className="text-slate-300 mb-2 block">Payment Amount ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="e.g., 500.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-slate-800/50 border-slate-600"
                                />
                            </div>
                            
                            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
                                    <TabsTrigger value="card"><CreditCard className="w-4 h-4 mr-2"/>Card</TabsTrigger>
                                    <TabsTrigger value="upi"><Wifi className="w-4 h-4 mr-2"/>UPI</TabsTrigger>
                                    <TabsTrigger value="netbanking"><Landmark className="w-4 h-4 mr-2"/>Net Banking</TabsTrigger>
                                </TabsList>
                                <TabsContent value="card" className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                                    <div className="space-y-4">
                                        <Input placeholder="Card Number" className="bg-slate-900/50 border-slate-600"/>
                                        <div className="flex gap-4">
                                            <Input placeholder="MM / YY" className="bg-slate-900/50 border-slate-600"/>
                                            <Input placeholder="CVC" className="bg-slate-900/50 border-slate-600"/>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="upi" className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                                    <Input placeholder="Enter UPI ID" className="bg-slate-900/50 border-slate-600"/>
                                    <p className="text-xs text-slate-400 mt-2 text-center">A payment request will be sent to your UPI app.</p>
                                </TabsContent>
                                <TabsContent value="netbanking" className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                                    <Select>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-600"><SelectValue placeholder="Select your bank..."/></SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-600">
                                            <SelectItem value="bank1">Global Bank</SelectItem>
                                            <SelectItem value="bank2">National Trust</SelectItem>
                                            <SelectItem value="bank3">City Bank Corp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TabsContent>
                            </Tabs>

                        </motion.div>
                    )}

                    <Button onClick={handlePayment} disabled={!selectedLeadId || !amount} className="w-full bg-gradient-to-r from-green-500 to-blue-500">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ${amount || '0.00'}
                    </Button>
                </div>
            </div>

            <div className="glass-effect rounded-xl p-6 opacity-60">
                <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Transaction History</h2>
                        <p className="text-slate-400">Future updates will display a list of all transactions.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FinancePage;
