/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Camera, Image as ImageIcon, MapPin, Clock, User, Shield, Activity, Trash2 } from 'lucide-react';
import { Ticket } from '../types';

interface TicketDetailModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Ticket>) => void;
}

export default function TicketDetailModal({ ticket, isOpen, onClose, onSave }: TicketDetailModalProps) {
  const [editedTicket, setEditedTicket] = useState<Ticket>({ ...ticket });
  const [newAttachment, setNewAttachment] = useState('');
  const [newResAttachment, setNewResAttachment] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(ticket.id, editedTicket);
    onClose();
  };

  const addAttachment = (type: 'general' | 'resolution') => {
    if (type === 'general') {
      const url = `https://picsum.photos/seed/${Math.random()}/800/600`;
      setEditedTicket(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), url]
      }));
    } else {
      const url = `https://picsum.photos/seed/${Math.random() + 1}/800/600`;
      setEditedTicket(prev => ({
        ...prev,
        resolutionAttachments: [...(prev.resolutionAttachments || []), url]
      }));
    }
  };

  const removeAttachment = (index: number, type: 'general' | 'resolution') => {
    if (type === 'general') {
      setEditedTicket(prev => ({
        ...prev,
        attachments: (prev.attachments || []).filter((_, i) => i !== index)
      }));
    } else {
      setEditedTicket(prev => ({
        ...prev,
        resolutionAttachments: (prev.resolutionAttachments || []).filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-5xl h-full max-h-[90vh] bg-charcoal border border-line rounded-lg shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-line bg-surface-dark flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center text-gold">
                <Shield size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gold/60">{ticket.id}</span>
                <h2 className="text-xl font-black text-text-main tracking-tighter uppercase leading-none">Modify Record</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gold transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="grid grid-cols-12 gap-10">
              {/* Left Column: Info */}
              <div className="col-span-8 space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Incident Title</label>
                  <input 
                    type="text"
                    value={editedTicket.title}
                    onChange={(e) => setEditedTicket({ ...editedTicket, title: e.target.value })}
                    className="w-full bg-white border border-line p-4 text-base font-black text-text-main uppercase tracking-tight focus:border-gold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fault Context</label>
                    <textarea 
                      value={editedTicket.faultType}
                      onChange={(e) => setEditedTicket({ ...editedTicket, faultType: e.target.value })}
                      className="w-full h-24 bg-white border border-line p-4 text-sm text-text-main focus:border-gold outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Location Metadata</label>
                    <textarea 
                      value={editedTicket.faultLocation}
                      onChange={(e) => setEditedTicket({ ...editedTicket, faultLocation: e.target.value })}
                      className="w-full h-24 bg-white border border-line p-4 text-sm text-text-main focus:border-gold outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Evidence Attachments</label>
                    <button 
                      onClick={() => addAttachment('general')}
                      className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-widest border border-gold/20 px-3 py-1 hover:bg-gold/10 transition-colors"
                    >
                      <Camera size={12} /> Add Simulation Frame
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {(editedTicket.attachments || []).map((img, i) => (
                      <div key={i} className="relative aspect-video bg-black border border-line overflow-hidden group">
                        <img src={img} alt="attachment" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                        <button 
                          onClick={() => removeAttachment(i, 'general')}
                          className="absolute top-2 right-2 p-1 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {(!editedTicket.attachments || editedTicket.attachments.length === 0) && (
                      <div className="col-span-3 h-24 border border-dashed border-line flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        No Evidence Recorded
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-line">
                  <div className="flex items-center gap-3 text-gold">
                    <Activity size={18} />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Resolution Protocol</h3>
                  </div>
                  <textarea 
                    value={editedTicket.resolution || ''}
                    onChange={(e) => setEditedTicket({ ...editedTicket, resolution: e.target.value })}
                    placeholder="Enter final telemetry fix and system state..."
                    className="w-full h-40 bg-gold/5 border border-gold/20 p-6 text-sm text-text-main focus:border-gold outline-none resize-none font-medium italic leading-relaxed"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Validation Screenshots</label>
                      <button 
                        onClick={() => addAttachment('resolution')}
                        className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-widest border border-gold/20 px-3 py-1 hover:bg-gold/10 transition-colors"
                      >
                        <ImageIcon size={12} /> Add Proof of Resolution
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {(editedTicket.resolutionAttachments || []).map((img, i) => (
                        <div key={i} className="relative aspect-video bg-black border border-line overflow-hidden group">
                          <img src={img} alt="resolution attachment" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => removeAttachment(i, 'resolution')}
                            className="absolute top-2 right-2 p-1 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {(!editedTicket.resolutionAttachments || editedTicket.resolutionAttachments.length === 0) && (
                        <div className="col-span-3 h-24 border border-dashed border-line flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                          Awaiting Resolution Documentation
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Metadata */}
              <div className="col-span-4 bg-surface-dark border border-line rounded p-8 space-y-8">
                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-line pb-4 italic">Environment Data</h4>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-gray-600">
                          <MapPin size={16} className="text-gold" />
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Sector</span>
                             <span className="text-xs font-bold">{ticket.faultLocation}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 text-gray-600">
                          <Clock size={16} className="text-gold" />
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Signal Latency</span>
                             <span className="text-xs font-bold">{ticket.latency}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 text-gray-600">
                          <User size={16} className="text-gold" />
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Supervisor</span>
                             <span className="text-xs font-bold">{ticket.supervisorName || 'N/A'}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-line space-y-4">
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Current Status</span>
                       <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 text-center rounded border ${
                         ticket.status === 'CLOSED' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-gold/10 text-gold border-gold/30'
                       }`}>
                         {ticket.status}
                       </span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Severity Class</span>
                       <select 
                         value={editedTicket.classification}
                         onChange={(e) => setEditedTicket({ ...editedTicket, classification: e.target.value as any, isManualClassification: true })}
                         className="w-full bg-white border border-line p-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-gold"
                       >
                         <option value="SMALL">Small (1h+)</option>
                         <option value="LIGHT">Light (&lt;3h)</option>
                         <option value="MEDIUM">Medium (&lt;6h)</option>
                         <option value="MAJOR">Major</option>
                         <option value="CATASTROPHIC">Catastrophic (12h+)</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-10 flex flex-col gap-4">
                    <button 
                      onClick={handleSave}
                      className="w-full py-4 bg-gold text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-gold/80 transition-all flex items-center justify-center gap-3"
                    >
                      <Save size={18} /> Update & Commit
                    </button>
                    <button 
                      onClick={onClose}
                      className="w-full py-4 bg-white border border-line text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gold transition-all"
                    >
                      Discard Changes
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
