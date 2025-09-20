import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileDown, Calendar, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = ({ leads, clients }) => {
    const { toast } = useToast();
    const [reportType, setReportType] = useState('leads');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const generateReport = (format) => {
        let data = reportType === 'leads' ? leads : clients;
        let headers, body;

        if (reportType === 'leads') {
            headers = ['Lead Name', 'Company', 'Source', 'Status', 'Assigned To', 'Created At'];
            body = data.map(item => [item.leadName, item.company, item.source, item.status, item.assignedTo, new Date(item.createdAt).toLocaleDateString()]);
        } else {
            headers = ['Client Name', 'Company', 'Status', 'Location', 'Created At'];
            body = data.map(item => [item.name, item.company, item.status, item.location, new Date(item.createdAt).toLocaleDateString()]);
        }
        
        // Date filtering
        if (startDate && endDate) {
            body = data.filter(item => {
                const itemDate = new Date(item.createdAt);
                return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
            }).map(item => reportType === 'leads'
                ? [item.leadName, item.company, item.source, item.status, item.assignedTo, new Date(item.createdAt).toLocaleDateString()]
                : [item.name, item.company, item.status, item.location, new Date(item.createdAt).toLocaleDateString()]
            );
        }

        if (body.length === 0) {
            toast({ title: "No data available for the selected criteria.", variant: "destructive" });
            return;
        }

        if (format === 'csv') {
            const csv = Papa.unparse({ fields: headers, data: body });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${reportType}_report.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 16);
            doc.autoTable({
                head: [headers],
                body: body,
                startY: 20
            });
            doc.save(`${reportType}_report.pdf`);
        } else {
             toast({ title: "Excel export is not yet implemented.", variant: "default" });
             return;
        }
        
        toast({ title: `Report downloaded as ${format.toUpperCase()}` });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Generate Reports</h2>
                    <p className="text-slate-400">Export your CRM data in various formats.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="font-semibold text-white">1. Select Report Type</h3>
                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger><ListFilter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="leads">Leads Report</SelectItem>
                            <SelectItem value="clients">Clients Report</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="font-semibold text-white">2. Select Date Range (Optional)</h3>
                     <div className="flex gap-4 items-center">
                        <Calendar className="w-5 h-5 text-slate-400"/>
                        <div className="flex-1">
                            <Label htmlFor="start-date" className="text-xs text-slate-400">Start Date</Label>
                            <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-900/50" />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="end-date" className="text-xs text-slate-400">End Date</Label>
                            <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-900/50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <h3 className="font-semibold text-white mb-4 text-center">3. Download Report</h3>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => generateReport('csv')} className="bg-green-600 hover:bg-green-700">
                        <FileDown className="w-4 h-4 mr-2" /> CSV
                    </Button>
                    <Button onClick={() => generateReport('pdf')} className="bg-red-600 hover:bg-red-700">
                        <FileDown className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button onClick={() => generateReport('excel')} className="bg-blue-600 hover:bg-blue-700">
                        <FileDown className="w-4 h-4 mr-2" /> Excel
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsPage;
