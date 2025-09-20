import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Pause, Play, Check, X, FileText, PhoneIncoming } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CallLogModal = ({ isOpen, onClose, lead }) => {
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState('idle'); // idle, dialing, active, ended
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (callStatus === 'active' && !isPaused) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus, isPaused]);
  
  useEffect(() => {
      if (!isOpen) {
          setCallStatus('idle');
          setTimer(0);
          setIsMuted(false);
          setIsPaused(false);
      }
  }, [isOpen]);

  const startCall = () => {
    setCallStatus('dialing');
    setTimeout(() => {
      setCallStatus('active');
    }, 2000); // Simulate dialing time
  };

  const endCall = () => {
    setCallStatus('ended');
    toast({
        title: "Call Ended",
        description: `Call with ${lead.leadName} has finished. Log your notes now.`,
    });
    // In a real app, you would now prompt to save call log
    setTimeout(() => {
        onClose();
    }, 2000);
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={`w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center ${callStatus === 'active' && 'animate-pulse'}`}>
              <PhoneIncoming className="w-5 h-5 text-white" />
            </div>
            Virtual Call
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center space-y-6 py-8"
        >
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
             <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {lead.leadName.charAt(0)}
             </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{lead.leadName}</p>
            <p className="text-slate-400">{lead.company}</p>
          </div>
          
          {callStatus === 'idle' && (
             <div className="text-center space-y-2">
                <p className="text-slate-300">Ready to call?</p>
                <p className="text-sm text-slate-500">Virtual Number: +1-555-CRM-PRO</p>
             </div>
          )}
          
          {callStatus === 'dialing' && (
              <p className="text-blue-400 animate-pulse">Dialing...</p>
          )}

          {callStatus === 'active' && (
             <p className="text-2xl font-mono text-green-400">{formatTime(timer)}</p>
          )}

          {callStatus === 'ended' && (
             <p className="text-red-400">Call Ended</p>
          )}
        </motion.div>
        
        {callStatus === 'active' && (
             <div className="flex justify-center gap-4">
                 <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={() => setIsMuted(!isMuted)}>
                     {isMuted ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={() => toast({title: "🚧 Feature not implemented"})}>
                    <Volume2 className="w-5 h-5"/>
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={() => setIsPaused(!isPaused)}>
                     {isPaused ? <Play className="w-5 h-5"/> : <Pause className="w-5 h-5"/>}
                 </Button>
             </div>
        )}

        <DialogFooter className="pt-4">
          {callStatus === 'idle' && (
              <Button onClick={startCall} className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2"/> Call {lead.contact}
              </Button>
          )}
          {(callStatus === 'active' || callStatus === 'dialing') && (
              <Button onClick={endCall} className="w-full bg-red-600 hover:bg-red-700">
                  <PhoneOff className="w-4 h-4 mr-2"/> End Call
              </Button>
          )}
          {callStatus === 'ended' && (
              <Button onClick={onClose} variant="outline" className="w-full">
                  <X className="w-4 h-4 mr-2"/> Close
              </Button>
          )}
        </DialogFooter>
        <div className="text-center mt-2">
            <Button variant="link" onClick={() => toast({ title: '🚧 Feature not implemented' })}>
                <FileText className="w-4 h-4 mr-2"/> Log call details manually
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallLogModal;