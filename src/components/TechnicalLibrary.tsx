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
    id: 'MANUAL-001',
    title: 'Offshore Resource Catalog',
    category: 'OPERATIONS',
    description: 'Local sector publication reference archive.',
    pdfUrl: '/OnG_1.pdf',
    lastUpdated: '2025-01-01',
  },
  {
    id: 'MANUAL-002',
    title: 'Technical Staff Incident Report',
    category: 'MAINTENANCE',
    description: 'Deep technical analysis of pressure containment and rig safety protocols.',
    pdfUrl: '/OnG_2.pdf',
    lastUpdated: '2024-11-12',
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

                {/* Real PDF Embedded Viewer */}
                <div className="flex-1 bg-charcoal relative">
                   <iframe 
                      src={`${selectedManual.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                      title={selectedManual.title}
                      referrerPolicy="no-referrer"
                   />
                   
                   {/* Local Navigation Overlay (Only visible if the iframe fails or for aesthetic) */}
                   <div className="absolute top-4 right-8 pointer-events-none">
                      <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-gold/30 rounded-sm">
                         <p className="text-[10px] font-black text-gold uppercase tracking-widest">
                            Sovereign View // {selectedManual.id}
                         </p>
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
