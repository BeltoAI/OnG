/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MOCK_TELEMETRY } from '../constants';
import SignalVisualizer from './SignalVisualizer';
import { motion, AnimatePresence } from 'motion/react';
import { Thermometer, Cpu, Radio, ExternalLink, Download, FileText, Activity, Layers } from 'lucide-react';
import { useState } from 'react';
import { Ticket } from '../types';

interface TelemetryPaneProps {
  ticket?: Ticket;
}

export default function TelemetryPane({ ticket }: TelemetryPaneProps) {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'manual' | 'signals'>('telemetry');

  const stats = [
    { label: 'Drill Bit Freq', value: '42.5 Hz', detail: 'STABLE' },
    { label: 'System Pressure', value: '1,240 PSI', detail: 'NOMINAL' },
    { label: 'Core Temp', value: '184 °F', detail: 'OPTIMAL' },
    { label: 'Node Latency', value: '14.2 ms', detail: 'GOOD' }
  ];

  return (
    <div className="h-full flex flex-col bg-charcoal border border-line rounded-lg shadow-2xl overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex shrink-0 border-b border-line h-16 bg-surface-dark px-4">
        {[
          { id: 'telemetry', label: 'Monitor Data', icon: Activity },
          { id: 'signals', label: 'Signal Trace', icon: Radio },
          { id: 'manual', label: 'Reference', icon: FileText }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 h-full text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border-b-2 ${
              activeTab === tab.id ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-gray-400 hover:text-gold'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'telemetry' && (
            <motion.div 
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-10 space-y-12 overflow-y-auto h-full custom-scrollbar"
            >
              <div>
                <h2 className="text-sm font-black text-gold uppercase tracking-[0.3em] mb-8 border-b border-gold/10 pb-4">Live Rig Monitoring</h2>
                <div className="grid grid-cols-2 gap-8">
                  {stats.map(s => (
                    <div key={s.label} className="p-8 bg-surface-mid border border-line rounded-lg hover:border-gold/30 transition-all group">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 group-hover:text-gold/50 transition-colors">{s.label}</p>
                       <div className="flex items-end justify-between">
                          <span className="text-3xl font-black text-text-main tracking-tighter leading-none">{s.value}</span>
                          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-sm">{s.detail}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-dark p-8 border border-line rounded-lg space-y-6">
                 <h3 className="text-[11px] font-black text-text-main uppercase tracking-widest opacity-30 italic">System Logs</h3>
                 <div className="space-y-4 font-mono text-[11px]">
                   <div className="flex justify-between border-b border-line/20 pb-2">
                     <span className="text-gray-500 uppercase">Edge Node Sync</span>
                     <span className="text-green-500">[ ACTIVE ]</span>
                   </div>
                   <div className="flex justify-between border-b border-line/20 pb-2">
                     <span className="text-gray-500 uppercase">Cloud Uplink</span>
                     <span className="text-gold">SECURED [98%]</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500 uppercase font-bold">Local Database</span>
                     <span className="text-text-main font-black">OPTIMIZED_SECURED</span>
                   </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'signals' && (
            <motion.div 
              key="signals"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 h-full flex flex-col"
            >
              <div className="flex-1 bg-surface-mid border border-line rounded-lg p-10 flex flex-col shadow-inner overflow-hidden">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xs font-black text-gold uppercase tracking-[0.2em]">Spectral Analysis</h3>
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Receiving Signal</span>
                    </div>
                 </div>
                 <div className="flex-1 flex items-end gap-[1px]">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${10 + Math.random() * 80}%`, `${30 + Math.random() * 60}%`, `${20 + Math.random() * 70}%`] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.05 }}
                        className="flex-1 bg-gold/10 min-h-[4px]"
                      />
                    ))}
                 </div>
              </div>
              <p className="mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Monitoring Frequency Phase Shift: Edge Sector 01</p>
            </motion.div>
          )}

          {activeTab === 'manual' && (
            <motion.div 
              key="manual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full p-8"
            >
               <div className="h-full bg-surface-mid border border-line rounded-lg overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-4 bg-surface-dark border-b border-line flex items-center justify-between">
                     <span className="text-[10px] font-black text-gold uppercase tracking-widest">Type-K-BOP-Manual.pdf</span>
                     <div className="flex gap-2">
                        <button className="p-2 border border-line text-gray-500 hover:text-gold transition-colors"><Download size={14}/></button>
                        <button className="p-2 border border-line text-gray-500 hover:text-gold transition-colors"><ExternalLink size={14}/></button>
                     </div>
                  </div>
                  <div className="flex-1 bg-white">
                    <iframe 
                      src="https://www.api.org/~/media/Files/Publications/Exploration/API_Bul_75L.pdf#toolbar=0" 
                      className="w-full h-full opacity-80 grayscale"
                      title="Sovereign Technical Manual"
                      referrerPolicy="no-referrer"
                    />
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-12 bg-surface-dark border-t border-line flex items-center px-8 justify-between shrink-0">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Latency: 12ms
            </span>
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Rig Sector: Gamma_9</span>
          </div>
          <span className="text-[9px] font-mono text-gold/20">SOVEREIGN_EDGE_STAGE_V02</span>
      </div>
    </div>
  );
}

