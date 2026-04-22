/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Database, 
  Share2, 
  FileText, 
  X, 
  Activity,
  Cpu,
  Globe
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-charcoal border-r border-line z-50 p-10 flex flex-col gap-10 shadow-[20px_0_40px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between border-b border-line pb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center border border-gold/20">
                  <Network className="text-gold w-6 h-6" />
                </div>
                <span className="text-lg font-black tracking-tighter text-text-main uppercase">BELTO</span>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-black/5 rounded-full transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <nav className="flex flex-col gap-10 flex-1">
              {/* Network Status */}
              <div>
                <h3 className="text-[10px] font-black text-gold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                  <Activity size={14} /> System Node Health
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-surface-dark border border-line rounded flex items-center justify-between cursor-help hover:border-gold/30 transition-all group">
                    <div className="flex items-center gap-4">
                       <Cpu size={18} className="text-gray-400 group-hover:text-gold transition-colors" />
                       <div>
                         <p className="text-sm font-black text-text-main leading-none">Main Hub 01</p>
                         <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">BELTO Core</p>
                       </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                  </div>
                </div>
              </div>

              {/* RAG Database */}
              <div>
                <h3 className="text-[10px] font-black text-gold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                  <Database size={14} /> Knowledge Hub
                </h3>
                <div className="flex flex-col gap-4">
                  {['Technical_Manual_K.pdf', 'Tool_Registry_V2.csv', 'Schematics_Main.dwg'].map((file) => (
                    <div key={file} className="flex items-center gap-4 group cursor-pointer">
                      <FileText size={18} className="text-gray-400 group-hover:text-gold transition-colors" />
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-gold transition-colors uppercase tracking-widest">{file}</span>
                    </div>
                  ))}
                </div>
              </div>

            </nav>

            <div className="pt-8 border-t border-line">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">
                V 4.2 // BELTO
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
