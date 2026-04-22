/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket, SystemStatus, TicketStatus } from '../types';
import ChatInterface from './ChatInterface';
import TelemetryPane from './TelemetryPane';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Book, Database, FileText, Activity, BookOpen } from 'lucide-react';
import TechnicalLibrary from './TechnicalLibrary';
import { useState } from 'react';

interface DiagnosticWorkspaceProps {
  ticket: Ticket | null;
  tickets: Ticket[];
  systemStatus: SystemStatus;
  activeStage: 'hub' | 'registry' | 'chat' | 'library';
  onStageChange: (stage: 'hub' | 'registry' | 'chat' | 'library') => void;
  onCreateTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (id: string, status: TicketStatus) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onResolveTicket: (id: string, resolution: string) => void;
  onEditTicket: (id: string) => void;
  onReferenceClick?: (stage: 'hub' | 'registry' | 'chat' | 'library') => void;
}

export default function DiagnosticWorkspace({ 
  ticket, 
  tickets, 
  systemStatus, 
  activeStage,
  onStageChange,
  onCreateTicket, 
  onUpdateTicketStatus,
  onUpdateTicket,
  onResolveTicket,
  onEditTicket,
  onReferenceClick
}: DiagnosticWorkspaceProps) {
  return (
    <div className="h-full flex overflow-hidden">
      {/* 
        SOVEREIGN DASHBOARD ARCHITECTURE 
        Left: AI Command Rail (Always the Assistant)
        Right: Master Stage (Diagnostic Hub + Expert chat)
      */}
      
      <div className="w-[38%] h-full border-r border-line flex flex-col bg-charcoal">
        <ChatInterface 
          pastTickets={tickets}
          mode="assistant"
          onCreateTicket={onCreateTicket}
          onResolveTicket={onResolveTicket}
          onReferenceClick={onReferenceClick || onStageChange}
        />
      </div>

      <div className="flex-1 h-full min-w-0 flex flex-col bg-surface-dark relative">
        <div className="flex bg-charcoal/50 border-b border-line px-6 pt-2 shrink-0 gap-8">
           {[
             { id: 'hub', label: 'Monitor_Data', icon: Activity },
             { id: 'library', label: 'Technical_Library', icon: BookOpen },
             { id: 'registry', label: 'Knowledge_Hub', icon: Database },
             ...(ticket ? [{ id: 'chat', label: 'Expert_Chat', icon: MessageSquare }] : [])
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => onStageChange(tab.id as any)}
               className={`pb-3 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 transition-all ${activeStage === tab.id ? 'text-gold border-b-2 border-gold shadow-[0_4px_10px_rgba(245,166,35,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
             >
               <tab.icon size={12} /> {tab.label}
             </button>
           ))}
        </div>

        <div className="flex-1 min-h-0 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeStage === 'chat' && ticket ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full bg-charcoal overflow-hidden rounded-sm border border-line"
              >
                <ChatInterface 
                  ticket={ticket}
                  mode="ticket"
                  pastTickets={tickets}
                  onResolveTicket={onResolveTicket}
                  onReferenceClick={onReferenceClick || onStageChange}
                />
              </motion.div>
            ) : activeStage === 'hub' ? (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <TelemetryPane ticket={ticket || undefined} />
              </motion.div>
            ) : activeStage === 'library' ? (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full bg-charcoal border border-line rounded-sm overflow-hidden"
              >
                <TechnicalLibrary />
              </motion.div>
            ) : activeStage === 'registry' ? (
              <motion.div
                key="registry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col gap-6"
              >
                 <div className="flex items-center justify-between border-b border-line pb-4">
                    <h2 className="text-xl font-black text-gold tracking-tighter uppercase">Knowledge Archive</h2>
                    <span className="font-mono text-[10px] text-gray-500">{tickets.length} ACTIVE RECORDS</span>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {tickets.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {tickets.map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => onEditTicket(t.id)}
                            className="p-4 bg-surface-mid border border-line rounded-sm flex flex-col gap-3 group hover:border-gold/40 transition-all cursor-pointer hover:shadow-lg"
                          >
                             <div className="flex justify-between items-center">
                               <span className="text-[10px] font-mono text-gold/60">{t.id}</span>
                               <span className={`text-[9px] px-2 py-0.5 border ${t.status === 'CLOSED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gold/10 text-gold border-gold/20'}`}>{t.status}</span>
                             </div>
                             <h4 className="text-sm font-black text-text-main line-clamp-1 uppercase tracking-tight">{t.title}</h4>
                             <div className="space-y-2">
                               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Diagnostic Outcome:</p>
                               <p className="text-[11px] text-text-main leading-relaxed bg-gold/5 p-2 border-l-2 border-gold font-medium italic">
                                 {t.resolution || "Protocol execution logged. Awaiting technical sign-off."}
                               </p>
                               {(t.resolutionAttachments?.length || 0) > 0 && (
                                 <div className="flex gap-2 pt-1 overflow-hidden">
                                   {t.resolutionAttachments?.slice(0, 3).map((img, idx) => (
                                     <div key={idx} className="w-12 h-8 bg-black border border-line rounded-sm overflow-hidden shrink-0">
                                       <img src={img} alt="resolution preview" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                                     </div>
                                   ))}
                                   {(t.resolutionAttachments?.length || 0) > 3 && (
                                     <div className="flex items-center text-[8px] font-black text-gold">+{(t.resolutionAttachments?.length || 0) - 3}</div>
                                   )}
                                 </div>
                               )}
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-20">
                         <Database size={48} />
                         <span className="mt-4 font-mono text-xs uppercase tracking-widest">No Sector Data Cached</span>
                      </div>
                    )}
                 </div>
              </motion.div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                   <Activity size={48} />
                   <span className="mt-4 font-mono text-xs uppercase tracking-widest">Awaiting Stage Engagement</span>
                </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Hardware Status Strip */}
        <div className="h-12 border-t border-line bg-surface-dark flex items-center px-6 gap-8 overflow-hidden shrink-0">
           <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-sm border border-line/20">
             <div className="w-1.5 h-1.5 rounded-full bg-status-red"></div> CLOUD_SYNC: DISABLED (OFFLINE)
           </div>
           <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-sm border border-line/20">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> CACHE_READ: LOCAL_SOVEREIGN
           </div>
           <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div> NODE: {ticket?.faultLocation || 'CENTRAL_GATEWAY'}
           </div>
        </div>
      </div>
    </div>
  );
}
