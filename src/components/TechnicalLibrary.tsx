/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, ExternalLink, Book, Shield, Zap, Cpu, ArrowLeft } from 'lucide-react';

interface Manual {
  id: string;
  title: string;
  category: 'OPERATIONS' | 'MAINTENANCE' | 'PROTOCOL';
  description: string;
  pdfUrl: string;
  lastUpdated: string;
  content?: string[];
}

const MANUALS: Manual[] = [
  {
    id: 'BELTO-OP-001',
    title: 'Sovereign Hub v3 Operations Manual',
    category: 'OPERATIONS',
    description: 'Core operational guidelines for managing RIG hardware clusters and telemetry sync protocols.',
    pdfUrl: 'https://www.api.org/~/media/Files/Publications/Exploration/API_Bul_75L.pdf',
    lastUpdated: '2024-01-15',
    content: [
      'SECTION 1.0: SYSTEM INITIALIZATION',
      'Ensure shunt current is stabilized at 1.45A before engaging telemetry uplink.',
      'RSC status must be verified as NOMINAL prior to drilling engagement.',
      'SECTION 2.0: FAULT ESCALATION',
      'In the event of an FPSR trip, the Sovereign Assistant must be engaged for micro-firmware correction.',
      'Terminal states (CLOSED/ARCHIVED) require supervisor sign-off via BELTO-SEC-004.'
    ]
  },
  {
    id: 'BELTO-MNT-042',
    title: 'FPSR Grid Maintenance & Safety',
    category: 'MAINTENANCE',
    description: 'Technical maintenance schedule for high-voltage sector coupling and capacitor bank grounding.',
    pdfUrl: 'https://www.energy.gov/sites/prod/files/2013/05/f0/Safety_Manual_Section_2.pdf',
    lastUpdated: '2023-11-20',
    content: [
      'SECTION 4.2: CAPACITOR BANK GROUNDING',
      'Prior to Sector 4 entry, all high-voltage capacitors must be manually discharged using the BELTO-ST-12 grounding rod.',
      'Verify SNR signals are above 8dB post-firmware update to prevent SNR Low timeouts.'
    ]
  },
  {
    id: 'BELTO-PRT-099',
    title: 'Node Communication Protocol Interface',
    category: 'PROTOCOL',
    description: 'Low-latency telemetry interface specifications (RSC/RSX/PSC) for offshore rig monitoring.',
    pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf',
    lastUpdated: '2024-03-01',
    content: [
      'APPENDIX A: TELEMETRY ERROR TABLES',
      'Error 0x44: SnR Underflow. Trigger SNR SNR Low fault.',
      'Error 0x88: Telemetry Desync. Logic gate restart required.',
      'Error 0xFF: Catastrophic Sector Bleed. Immediate RIG evacuation protocol 12.'
    ]
  }
];

export default function TechnicalLibrary() {
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredManuals = MANUALS.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-charcoal text-text-main font-sans">
      <AnimatePresence mode="wait">
        {!selectedManual ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col p-10 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-gold">Technical Library</h2>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Sovereign Data Cluster / Offline Archives</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-mid border border-line pl-10 pr-4 py-2 text-xs font-mono focus:border-gold outline-none w-64"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
              {filteredManuals.map((manual) => (
                <motion.div 
                  key={manual.id}
                  whileHover={{ scale: 1.02, borderColor: '#FF6B00' }}
                  onClick={() => setSelectedManual(manual)}
                  className="p-6 bg-surface-mid border border-line rounded-sm cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-gold/60">{manual.id}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-black border border-line text-gray-400 font-black uppercase">
                        {manual.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-gold transition-colors mb-2">
                      {manual.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                      {manual.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-line/40 pt-4">
                    <span className="text-[9px] font-mono text-gray-600">Updated: {manual.lastUpdated}</span>
                    <FileText size={16} className="text-gold/40 group-hover:text-gold transition-colors" />
                  </div>
                </motion.div>
              ))}
              {filteredManuals.length === 0 && (
                <div className="col-span-full h-64 flex flex-col items-center justify-center opacity-20">
                  <Search size={48} />
                  <span className="mt-4 font-mono text-xs uppercase tracking-widest text-center">No matching records found in local sector cache</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="viewer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Toolbar */}
            <div className="p-4 bg-surface-dark border-b border-line flex items-center justify-between">
              <button 
                onClick={() => setSelectedManual(null)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gold transition-all"
              >
                <ArrowLeft size={16} /> Back to Library
              </button>
              <div className="flex items-center gap-6">
                <span className="text-xs font-black uppercase tracking-widest text-gold">{selectedManual.title}</span>
                <button 
                  onClick={() => window.open(selectedManual.pdfUrl, '_blank')}
                  className="flex items-center gap-2 px-3 py-1 bg-gold text-black text-[10px] font-black uppercase tracking-widest"
                >
                  <ExternalLink size={12} /> Open PDF Link
                </button>
              </div>
            </div>

            <div className="flex-1 flex relative overflow-hidden">
               {/* Sidebar navigation */}
               <div className="w-64 border-r border-line bg-surface-mid/50 p-6 space-y-6 hidden md:block">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Manual Index</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-gold">
                        <Book size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Introduction</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 hover:text-gold cursor-pointer transition-colors">
                        <Shield size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Safety Systems</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 hover:text-gold cursor-pointer transition-colors">
                        <Zap size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Power Grid</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 hover:text-gold cursor-pointer transition-colors">
                        <Cpu size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Logic Hub</span>
                     </div>
                  </div>
               </div>

               {/* Simulated PDF Viewer */}
               <div className="flex-1 bg-white overflow-y-auto p-12 custom-scrollbar">
                  <div className="max-w-3xl mx-auto shadow-2xl border border-gray-200 min-h-[140%] p-16 flex flex-col gap-10">
                    <div className="border-b-4 border-black pb-8 flex justify-between items-start">
                       <div>
                          <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">BELTO INDUSTRIAL</h1>
                          <p className="text-xs font-mono text-gray-500 uppercase font-bold tracking-widest">{selectedManual.id} — CONFIDENTIAL</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-black uppercase">Approved for Offshore Use</p>
                          <p className="text-[10px] text-gray-500">REV: {selectedManual.lastUpdated}</p>
                       </div>
                    </div>

                    <div className="space-y-12">
                       <h2 className="text-2xl font-black text-black uppercase border-b border-gray-200 pb-4">{selectedManual.title}</h2>
                       <div className="space-y-8">
                          {selectedManual.content?.map((text, idx) => (
                            <p 
                              key={idx} 
                              className={`text-sm leading-relaxed ${text.startsWith('SECTION') ? 'font-black uppercase text-black pt-4' : 'text-gray-700 italic'}`}
                            >
                               {text}
                            </p>
                          ))}
                          <div className="p-8 bg-gray-50 border-line border rounded-sm font-mono text-[11px] text-gray-500 leading-relaxed uppercase">
                             Warning: This record is strictly for Sovereign Node clusters. 
                             Local offline execution requires manual telemetry calibration at Node 04.
                             Standard rig latency is 14ms. SNR snr values must be monitored via PSC detector.
                          </div>
                       </div>
                    </div>

                    <div className="mt-auto pt-20 flex justify-between items-end border-t border-gray-100 italic text-gray-400 text-[10px]">
                       <span>Digitized Archive — BELTO CLOUD SYNC: ERROR (OFFLINE)</span>
                       <span>Page 01 of 124</span>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
