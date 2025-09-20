import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Papa from 'papaparse';

let lastAssignedIndex = 0;

const ImportLeadsModal = ({ isOpen, onClose, onImport, roundRobinEnabled }) => {
    const { toast } = useToast();
    const { user, getAssignableUsers } = useAuth();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const assignableUsers = getAssignableUsers();

    const handleFileChange = (e) => {
        setError('');
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "text/csv") {
                setError("Invalid file type. Please upload a CSV file.");
                setFile(null);
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setError('');
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "text/csv") {
            setFile(droppedFile);
        } else {
            setError("Invalid file type. Please upload a CSV file.");
            setFile(null);
        }
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleImport = () => {
        if (!file) {
            setError("Please select a file to import.");
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const requiredFields = ['leadName', 'company', 'email'];
                const headers = results.meta.fields;
                const missingHeaders = requiredFields.filter(h => !headers.includes(h));

                if (missingHeaders.length > 0) {
                    setError(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
                    return;
                }

                const newLeads = results.data.map((row, index) => {
                    let assignedTo = user.email;
                    if (roundRobinEnabled && assignableUsers.length > 0) {
                        assignedTo = assignableUsers[lastAssignedIndex % assignableUsers.length].email;
                        lastAssignedIndex++;
                    }

                    return {
                        id: Date.now() + index,
                        leadName: row.leadName,
                        company: row.company,
                        email: row.email,
                        contact: row.contact || '',
                        source: row.source || 'CSV Import',
                        notes: row.notes || '',
                        status: 'not-started',
                        assignedTo: assignedTo,
                        createdAt: new Date().toISOString(),
                        callHistory: []
                    };
                });
                
                onImport(newLeads);
                onClose();
                setFile(null);
            },
            error: (err) => {
                setError(`Error parsing CSV: ${err.message}`);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <UploadCloud className="w-5 h-5 text-white" />
                        </div>
                        Import Leads from CSV
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 py-4"
                >
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-blue-500 transition-colors"
                    >
                        <input type="file" id="csv-upload" className="hidden" accept=".csv" onChange={handleFileChange} />
                        <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full cursor-pointer">
                            <UploadCloud className="w-12 h-12 text-slate-500 mb-4" />
                            {file ? (
                                <p className="text-green-400 flex items-center gap-2"><File className="w-4 h-4"/>{file.name}</p>
                            ) : (
                                <>
                                <p className="text-slate-300">Drag & drop your CSV file here</p>
                                <p className="text-sm text-slate-500">or</p>
                                <Button asChild variant="outline" className="mt-2"><span>Browse Files</span></Button>
                                </>
                            )}
                        </label>
                    </div>

                    {error && (
                        <div className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div>
                        <h4 className="font-semibold text-slate-300 mb-2">Instructions:</h4>
                        <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                            <li>Required headers: `leadName`, `company`, `email`.</li>
                            <li>Optional headers: `contact`, `source`, `notes`.</li>
                            <li>Status is set to 'not-started' automatically.</li>
                            <li>If Round-Robin is enabled in settings, leads will be auto-assigned. Otherwise, they are assigned to you.</li>
                        </ul>
                    </div>
                </motion.div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!file} className="bg-gradient-to-r from-green-500 to-blue-500">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Import Leads
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImportLeadsModal;