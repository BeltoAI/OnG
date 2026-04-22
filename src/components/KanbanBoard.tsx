/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket, TicketStatus, TicketClassification } from '../types';
import { motion } from 'motion/react';
import { Clock, MessageSquare, MapPin, Trash2, AlertCircle, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';

interface KanbanBoardProps {
  tickets: Ticket[];
  onSelectTicket: (id: string) => void;
  onDeleteTicket: (id: string) => void;
  onUpdateTicketStatus: (id: string, status: TicketStatus) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onResolveTicket: (id: string, resolution: string) => void;
  onEditTicket: (id: string) => void;
}

const COLUMNS: TicketStatus[] = ['OPEN', 'IN-PROGRESS', 'CLOSED'];
const CLASSIFICATIONS: TicketClassification[] = ['SMALL', 'LIGHT', 'MEDIUM', 'MAJOR', 'CATASTROPHIC'];

const getClassificationColor = (c: TicketClassification) => {
  switch (c) {
    case 'SMALL': return 'text-blue-500 border-blue-500/30 bg-blue-500/5';
    case 'LIGHT': return 'text-cyan-500 border-cyan-500/30 bg-cyan-500/5';
    case 'MEDIUM': return 'text-gold border-gold/30 bg-gold/5';
    case 'MAJOR': return 'text-orange-500 border-orange-500/30 bg-orange-500/5';
    case 'CATASTROPHIC': return 'text-status-red border-status-red/30 bg-status-red/5';
    default: return 'text-gray-500 border-line bg-surface-dark';
  }
};

function LiveTimer({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(Date.now() - new Date(createdAt).getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Date.now() - new Date(createdAt).getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  const seconds = Math.floor(elapsed / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  return (
    <span className="font-mono text-[10px] tracking-widest text-gold opacity-80">
      {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </span>
  );
}

export default function KanbanBoard({ tickets, onSelectTicket, onDeleteTicket, onUpdateTicketStatus, onUpdateTicket, onResolveTicket, onEditTicket }: KanbanBoardProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const moveTicket = (id: string, currentStatus: TicketStatus, direction: 'next' | 'prev') => {
    const currentIndex = COLUMNS.indexOf(currentStatus);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      onUpdateTicketStatus(id, COLUMNS[nextIndex]);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    onUpdateTicketStatus(draggableId, destination.droppableId as TicketStatus);
  };

  if (tickets.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-charcoal text-center">
        <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mb-6 border border-gold/20">
          <AlertCircle className="text-gold" size={32} />
        </div>
        <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2">Queue Depleted</h2>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest max-w-sm">
          No active fault tickets in Sovereign Node cluster. Initialize core assistant to triage hardware issues.
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="h-full p-8 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto bg-charcoal custom-scrollbar">
        {COLUMNS.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-8 min-h-[200px]"
              >
                <div className="flex items-center justify-between border-b-2 border-line pb-4">
                  <h2 className="text-xs font-black text-gray-500 tracking-[0.4em] uppercase">
                    {status}
                  </h2>
                  <span className="text-xs font-mono px-3 py-1 bg-surface-mid border border-line text-gold">
                    {tickets.filter(t => t.status === status).length}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {tickets
                    .filter((t) => t.status === status)
                    .map((ticket, index) => (
                      <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <motion.div
                              layoutId={ticket.id}
                              whileHover={{ scale: 1.01, borderColor: '#FF6B00' }}
                              className="p-6 bg-surface-mid border border-line rounded-sm cursor-pointer transition-all flex flex-col gap-6 group relative overflow-hidden shadow-sm hover:shadow-lg"
                              onClick={() => onEditTicket(ticket.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <span className="text-xs font-mono text-gold group-hover:opacity-100 opacity-60 block mb-2 uppercase tracking-widest">
                                    {ticket.id}
                                  </span>
                                  <h3 className="text-lg font-black leading-tight text-text-main group-hover:text-gold transition-colors uppercase tracking-tight">
                                    {ticket.title}
                                  </h3>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                  <div className="flex bg-surface-dark border border-line rounded-sm overflow-hidden p-1">
                                    {CLASSIFICATIONS.map((c) => (
                                      <button
                                        key={c}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onUpdateTicket(ticket.id, { classification: c, isManualClassification: true });
                                        }}
                                        className={`w-6 h-6 flex items-center justify-center text-[8px] font-black transition-all ${
                                          ticket.classification === c 
                                            ? 'bg-gold text-black scale-110 z-10' 
                                            : 'text-gray-600 hover:text-gold'
                                        }`}
                                        title={`Reclassify as ${c}`}
                                      >
                                        {c[0]}
                                      </button>
                                    ))}
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteTicket(ticket.id);
                                    }}
                                    className="p-2 text-gray-700 hover:text-status-red transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between bg-surface-dark/50 p-3 border-line border rounded-sm relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${getClassificationColor(ticket.classification).split(' ')[1]}`} />
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Downtime Severity</span>
                                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 border rounded-sm ${getClassificationColor(ticket.classification)}`}>
                                    {ticket.classification}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Timer</span>
                                  <LiveTimer createdAt={ticket.createdAt} />
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest text-xs">
                                  <Clock size={14} className="text-gold/60" />
                                  <span className="font-bold">{ticket.latency}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest text-xs">
                                  <MessageSquare size={14} className="text-gold/60" />
                                  <span className="font-bold">{ticket.messageCount} MESSAGES</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-line/40">
                                <div className="flex gap-2">
                                  <button 
                                    disabled={ticket.status === 'OPEN'}
                                    onClick={(e) => { e.stopPropagation(); moveTicket(ticket.id, ticket.status, 'prev'); }}
                                    className="p-1.5 border border-line text-gray-700 hover:text-gold disabled:opacity-20 transition-all rounded"
                                  >
                                    <ChevronLeft size={14} />
                                  </button>
                                  <button 
                                    disabled={ticket.status === 'CLOSED'}
                                    onClick={(e) => { e.stopPropagation(); moveTicket(ticket.id, ticket.status, 'next'); }}
                                    className="p-1.5 border border-line text-gray-700 hover:text-gold disabled:opacity-20 transition-all rounded"
                                  >
                                    <ChevronRight size={14} />
                                  </button>
                                  {ticket.status !== 'CLOSED' && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setResolvingId(ticket.id);
                                        setResolutionText('');
                                      }}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-600 text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all rounded"
                                    >
                                      <CheckCircle2 size={12} /> Resolve
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                  {(ticket.attachments?.length || 0) > 0 && (
                                    <div className="flex -space-x-2 mr-2">
                                      {ticket.attachments?.slice(0, 3).map((img, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-mid overflow-hidden bg-black">
                                          <img src={img} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <MapPin size={12} />
                                  <span className="text-[10px] uppercase font-black truncate max-w-[100px] tracking-widest">{ticket.faultLocation}</span>
                                </div>
                              </div>

                              {resolvingId === ticket.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-4 pt-4 border-t border-line space-y-3"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Resolution Protocol:</p>
                                  <textarea 
                                    autoFocus
                                    value={resolutionText}
                                    onChange={(e) => setResolutionText(e.target.value)}
                                    placeholder="Enter final telemetry fix..."
                                    className="w-full h-24 bg-charcoal border border-line p-3 text-xs text-text-main focus:border-gold outline-none resize-none font-mono"
                                  />
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => {
                                        if (resolutionText.trim()) {
                                          onResolveTicket(ticket.id, resolutionText);
                                          setResolvingId(null);
                                        }
                                      }}
                                      className="flex-1 py-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
                                    >
                                      Finalize & Archive
                                    </button>
                                    <button 
                                      onClick={() => setResolvingId(null)}
                                      className="px-4 py-2 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
