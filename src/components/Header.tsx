/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, ChevronDown, AlertCircle, ShieldCheck, HeartPulse, LayoutGrid, Terminal, Boxes } from 'lucide-react';
import { Ticket, SystemStatus, TicketStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import KanbanBoard from './KanbanBoard';

interface HeaderProps {
  status: SystemStatus;
  tickets: Ticket[];
  activeTicketId: string | null;
  onTicketChange: (id: string) => void;
  onToggleSidebar: () => void;
  onStatusToggle: () => void;
  onDeleteTicket: (id: string) => void;
  onUpdateTicketStatus: (id: string, status: TicketStatus) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onResolveTicket: (id: string, resolution: string) => void;
  onEditTicket: (id: string) => void;
}

export default function Header({
  status,
  tickets,
  activeTicketId,
  onTicketChange,
  onToggleSidebar,
  onStatusToggle,
  onDeleteTicket,
  onUpdateTicketStatus,
  onUpdateTicket,
  onResolveTicket,
  onEditTicket
}: HeaderProps) {
  const [showRegistry, setShowRegistry] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'BLEEDING':
        return { color: 'bg-status-red', label: 'URGENT' };
      case 'SECURED':
        return { color: 'bg-secure-blue', label: 'SECURED' };
      default:
        return { color: 'bg-nom-gray', label: 'NOMINAL' };
    }
  };

  const config = getStatusConfig();
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  return (
    <>
      <header className="h-16 border-b border-line bg-charcoal flex items-center justify-between px-8 z-30 shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleSidebar}
              className="text-gold p-2 border border-gold/10 hover:border-gold/30 rounded-sm transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="text-xl font-black text-text-main tracking-tighter flex items-center gap-2">
              BELTO
            </div>
          </div>
          
          <div 
            onClick={onStatusToggle}
            className={`px-4 py-1.5 rounded-sm flex items-center gap-3 cursor-pointer transition-all ${config.color} text-white shadow-md`}
          >
            <span className="text-[10px] font-black tracking-widest">{config.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 border border-line bg-surface-dark rounded-sm">
            <div className="w-2 h-2 rounded-full bg-status-red animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">OFFLINE: SOVEREIGN CACHE</span>
          </div>

          <button 
            onClick={() => setShowRegistry(true)}
            className="flex items-center gap-3 px-6 py-2 bg-charcoal border border-line text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gold hover:border-gold/30 transition-all rounded-sm"
          >
            <Boxes size={16} /> Hub Registry
          </button>

          <div className="relative group">
            <div className="flex bg-surface-dark rounded-sm overflow-hidden border border-line cursor-pointer hover:border-gold/50 transition-all">
              <div className="px-6 py-2.5 text-[11px] font-mono text-gold flex items-center gap-3 min-w-[200px]">
                {activeTicket?.id || 'GLOBAL_ASSIST'} <ChevronDown size={14} className="opacity-30" />
              </div>
            </div>
            
            <div className="absolute top-full right-0 mt-2 w-72 bg-surface-mid border border-line rounded-sm shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50 overflow-hidden">
               <button
                  onClick={() => onTicketChange('')}
                  className="w-full text-left px-6 py-4 hover:bg-gold/10 border-b border-line flex items-center justify-between"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest text-gold text-opacity-70">Main Assistant</span>
                  <Terminal size={14} className="text-gold text-opacity-50" />
                </button>
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTicketChange(t.id)}
                  className="w-full text-left px-6 py-5 hover:bg-gold/10 border-b border-line last:border-0 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gold/40">{t.id}</span>
                    <span className={`w-2 h-2 rounded-full ${t.status === 'IN-PROGRESS' ? 'bg-blue-500' : t.status === 'OPEN' ? 'bg-gold' : 'bg-green-500'}`} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight text-text-main line-clamp-1">{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showRegistry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 30 }}
              className="w-full max-w-7xl h-full bg-charcoal border border-line rounded-sm flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-line bg-surface-dark flex items-center justify-between">
                 <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center text-gold">
                      <Boxes size={28} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">Hub Node Registry</h2>
                      <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">Active Incident Clusters</p>
                   </div>
                 </div>
                 <button 
                  onClick={() => setShowRegistry(false)}
                  className="h-12 px-8 border border-line text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:border-white transition-all rounded-sm"
                 >
                   [ Close Registry ]
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <KanbanBoard 
                  tickets={tickets} 
                  onSelectTicket={(id) => {
                    onTicketChange(id);
                    setShowRegistry(false);
                  }}
                  onDeleteTicket={onDeleteTicket}
                  onUpdateTicketStatus={onUpdateTicketStatus}
                  onUpdateTicket={onUpdateTicket}
                  onResolveTicket={onResolveTicket}
                  onEditTicket={onEditTicket}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
