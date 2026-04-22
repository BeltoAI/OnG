/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, UserCog, MessageSquare, Terminal, FileText, CheckCircle2, Archive } from 'lucide-react';
import { ChatMessage, Ticket } from '../types';
import { getDiagnosticResponse } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface ChatInterfaceProps {
  onCreateTicket?: (ticket: Ticket) => void;
  onReferenceClick?: (stage: 'hub' | 'registry' | 'chat' | 'library') => void;
  onResolveTicket?: (id: string, resolution: string) => void;
  ticket?: Ticket;
  mode: 'assistant' | 'ticket';
  pastTickets: Ticket[];
}

export default function ChatInterface({ onCreateTicket, onReferenceClick, onResolveTicket, ticket, mode, pastTickets }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [routingMode, setRoutingMode] = useState<'AUTO' | 'EDGE' | 'CLOUD'>('AUTO');
  const [escalationStep, setEscalationStep] = useState<'none' | 'location' | 'depth' | 'supervisor' | 'confirm'>('none');
  const [escalationData, setEscalationData] = useState<Partial<Ticket>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const experts = mode === 'ticket' ? [
    { name: 'Sarah', role: 'Support Engineer', status: 'Online' },
    { name: 'Linus', role: 'Hardware Expert', status: 'In Call' }
  ] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Reset and initialize messages when mode or active ticket changes
    setMessages([]); 
    if (mode === 'assistant') {
      const initial: ChatMessage = {
        id: 'initial',
        sender: 'ai',
        text: "I see the **L-X Signal** and **Beta-9** feed are currently drifting outside nominal parameters. This reminds me of calibration slips indexed in **TICKET-001** and **TICKET-003**.\n\nHave a look at the **Technical_Manual_K.pdf, Page 4** for recalibration protocols.",
        timestamp: new Date().toISOString(),
        source: 'SYSTEM'
      };
      setMessages([initial]);
    } else if (ticket) {
      const initial: ChatMessage = {
        id: 'ticket-init',
        sender: 'ai',
        text: `You are now in a dedicated support thread for Ticket **${ticket.id}**. Our engineers are reviewing your data.`,
        timestamp: new Date().toISOString(),
        source: 'SYSTEM'
      };
      setMessages([initial]);
    }
  }, [ticket?.id, mode]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (escalationStep !== 'none') {
        handleEscalationFlow(inputValue);
      } else {
        const { text, source } = await getDiagnosticResponse(inputValue, {
          ticketId: ticket?.id,
          routing: routingMode,
          pastTickets
        });
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-ai',
          sender: 'ai',
          text,
          timestamp: new Date().toISOString(),
          source
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text: 'I had some trouble connecting. Please try again or create a ticket for help.',
        timestamp: new Date().toISOString(),
        source: 'SYSTEM'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalationFlow = (input: string) => {
    const timestamp = new Date().toISOString();
    switch (escalationStep) {
      case 'location':
        setEscalationData(prev => ({ ...prev, faultLocation: input, title: `Issue at ${input}` }));
        setEscalationStep('depth');
        setMessages(prev => [...prev, { id: 'esc-d', sender: 'ai', text: 'Got it. What is the current **Hole Depth** (meters)?', timestamp, source: 'SYSTEM' }]);
        break;
      case 'depth':
        setEscalationData(prev => ({ ...prev, holeDepth: input }));
        setEscalationStep('supervisor');
        setMessages(prev => [...prev, { id: 'esc-s', sender: 'ai', text: 'And who is the **Supervisor** on duty?', timestamp, source: 'SYSTEM' }]);
        break;
      case 'supervisor':
        setEscalationData(prev => ({ ...prev, supervisorName: input }));
        setEscalationStep('confirm');
        setMessages(prev => [...prev, { 
          id: 'esc-c',
          sender: 'ai', 
          text: 'Perfect. I have prepared a support request. Please review it below.', 
          timestamp,
          source: 'SYSTEM'
        }]);
        break;
    }
  };

  const startTriage = () => {
    setEscalationStep('location');
    setMessages(prev => [...prev, {
      id: 'triage-start',
      sender: 'ai',
      text: 'To connect you with an engineer, I need a few quick details. First, what is the **location** of the issue?',
      timestamp: new Date().toISOString(),
      source: 'SYSTEM'
    }]);
  };

  const finalConfirmTicket = () => {
    const newTicket: Ticket = {
      id: `TIC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      title: escalationData.title || 'Support Request',
      status: 'OPEN',
      latency: 'Optimal',
      messageCount: messages.length,
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      classification: 'SMALL',
      faultType: 'User Reported',
      faultLocation: escalationData.faultLocation || 'Site',
      engineerProposedSolution: 'Awaiting expert review',
      ...escalationData
    };

    onCreateTicket?.(newTicket);
    setEscalationStep('none');
    setEscalationData({});
    setMessages(prev => [...prev, {
      id: 'final-confirm',
      sender: 'ai',
      text: `Ticket **${newTicket.id}** created. You are now being connected to our engineers.`,
      timestamp: new Date().toISOString(),
      source: 'SYSTEM'
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-charcoal">
      <div className="h-16 border-b border-line shrink-0 px-6 flex items-center justify-between bg-surface-dark">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center text-gold border border-gold/20">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-gold opacity-80">
              {mode === 'assistant' ? 'Sovereign Assistant' : 'Support Thread'}
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
              {mode === 'assistant' ? 'Always Online' : `Connected to Ticket ${ticket?.id}`}
            </p>
          </div>
        </div>

        {mode === 'ticket' && (
          <div className="flex -space-x-2">
            {experts.map(e => (
              <div 
                key={e.name} 
                className="w-8 h-8 rounded-full border-2 border-charcoal bg-surface-mid flex items-center justify-center text-[10px] font-black text-gold relative group cursor-help"
              >
                {e.name[0]}
                <div className="absolute top-full right-0 mt-2 w-48 bg-black border border-line p-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                  <p className="text-[10px] font-black text-gold uppercase">{e.name}</p>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{e.role}</p>
                  <p className="text-white text-[8px] mt-2 opacity-50 uppercase tracking-widest">Status: {e.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-12 h-12 shrink-0 bg-surface-mid border border-line rounded-lg flex items-center justify-center text-gold shadow-lg">
                  <Bot size={24} />
                </div>
              )}
              
              <div className={`max-w-[75%] flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-5 rounded-sm text-[16px] leading-relaxed relative ${
                  msg.sender === 'user' 
                    ? 'bg-gold text-black font-bold' 
                    : 'bg-charcoal border border-line text-text-main shadow-sm'
                }`}>
                  <div className="markdown-body">
                    <Markdown>{msg.text}</Markdown>
                  </div>

                   {msg.text.includes('.pdf') && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => onReferenceClick?.('library')}
                        className="flex items-center gap-2 px-3 py-1 bg-gold hover:bg-gold/80 border border-gold rounded text-[10px] font-black text-black uppercase transition-all"
                      >
                        <FileText size={12} /> Open in Sovereign Library
                      </button>
                    </div>
                  )}

                  {msg.text.includes('TICKET-') && (
                    <div className="mt-4 flex flex-wrap gap-2">
                       {['TICKET-001', 'TICKET-003'].filter(t => msg.text.includes(t)).map(ticketId => (
                         <button
                           key={ticketId}
                           onClick={() => onReferenceClick?.('registry')}
                           className="flex items-center gap-2 px-3 py-1 bg-charcoal hover:bg-surface-dark border border-line rounded text-[10px] font-black text-gold uppercase transition-all"
                         >
                            Archive Ref: {ticketId}
                         </button>
                       ))}
                    </div>
                  )}

                  {msg.source && msg.source !== 'SYSTEM' && (
                    <div className="mt-4 pt-3 border-t border-line/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gold/40 uppercase tracking-widest">Source:</span>
                        <button 
                          onClick={() => onReferenceClick?.(msg.source === 'EDGE' ? 'library' : 'hub')}
                          className="text-[10px] font-black text-gray-400 hover:text-gold transition-colors uppercase tracking-widest"
                        >
                          {msg.source} NODE
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.sender === 'ai' && mode === 'assistant' && escalationStep === 'none' && (
                    <div className="mt-6 pt-4 border-t border-line/30 flex justify-end">
                       <button
                         onClick={startTriage}
                         className="flex items-center gap-2 px-4 py-2 bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all"
                       >
                         <UserCog size={14} /> Create Ticket
                       </button>
                    </div>
                  )}
                </div>
                
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 opacity-40 px-1 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-12 h-12 shrink-0 bg-gold border border-gold rounded-lg flex items-center justify-center text-black shadow-lg">
                  <User size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {escalationStep === 'confirm' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-surface-dark border-2 border-gold/40 rounded-sm space-y-8 shadow-[0_0_50px_rgba(245,166,35,0.1)]"
          >
            <div className="flex items-center gap-4 border-b border-line pb-4">
              <UserCog className="text-gold" size={28} />
              <h3 className="text-xl font-black text-text-main tracking-tighter uppercase">Incident Summary</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Target Area</span>
                  <span className="text-base font-black text-text-main uppercase">{escalationData.faultLocation}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Hole Depth</span>
                  <span className="text-base font-black text-text-main">{escalationData.holeDepth}m</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Supervisor</span>
                  <span className="text-base font-black text-text-main uppercase">{escalationData.supervisorName}</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Protocol</span>
                   <span className="text-base font-black text-green-600 uppercase tracking-widest">OK</span>
                </div>
              </div>
            </div>

            <button 
              onClick={finalConfirmTicket}
              className="w-full py-5 bg-gold text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-surface-dark transition-all shadow-2xl active:scale-95"
            >
              Submit and Connect
            </button>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex gap-6 opacity-30">
            <div className="w-12 h-12 bg-surface-mid border border-line rounded-lg" />
            <div className="bg-surface-mid px-8 py-5 border border-line rounded-lg w-32 animate-pulse" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 bg-surface-dark border-t border-line">
        {mode === 'ticket' && ticket && ticket.status !== 'CLOSED' && !isResolving && (
          <div className="mb-6 flex justify-center">
            <button 
              onClick={() => setIsResolving(true)}
              className="flex items-center gap-3 px-8 py-3 bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-black uppercase tracking-[0.2em] hover:bg-green-500 hover:text-white transition-all rounded-sm shadow-sm"
            >
              <CheckCircle2 size={16} /> Mark Incident as Resolved
            </button>
          </div>
        )}

        {isResolving && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-charcoal border-2 border-green-500/30 rounded-sm space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 text-green-600 border-b border-line pb-3">
              <Archive size={18} />
              <h4 className="text-xs font-black uppercase tracking-widest">Formal Resolution Entry</h4>
            </div>
            <textarea 
              autoFocus
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Detail the technical steps taken to clear the fault..."
              className="w-full h-32 bg-surface-dark border border-line p-4 text-sm text-text-main focus:border-green-500 outline-none resize-none font-mono"
            />
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (resolutionText.trim() && onResolveTicket && ticket) {
                    onResolveTicket(ticket.id, resolutionText);
                    setIsResolving(false);
                    setResolutionText('');
                  }
                }}
                className="flex-1 py-3 bg-green-500 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-green-600 transition-all"
              >
                Seal & Archive Ticket
              </button>
              <button 
                onClick={() => setIsResolving(false)}
                className="px-6 py-3 bg-gray-200 text-gray-600 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-300 transition-all"
              >
                Abort
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'assistant' && (
          <div className="mb-4 flex items-center gap-2">
            {[
              { id: 'AUTO', label: 'Adaptive Auto' },
              { id: 'EDGE', label: 'Local Edge' },
              { id: 'CLOUD', label: 'Sovereign Cloud' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setRoutingMode(mode.id as any)}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border transition-all rounded-sm ${
                  routingMode === mode.id 
                    ? 'bg-gold border-gold text-black' 
                    : 'border-line text-gray-500 hover:text-gray-300'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={mode === 'assistant' ? "Ask the Sovereign Assistant a question..." : "Reply to support..."}
            className="w-full bg-charcoal border border-line text-text-main px-8 py-6 pr-24 rounded-lg focus:outline-none focus:border-gold/50 transition-all text-lg placeholder:text-gray-600 resize-none min-h-[100px] shadow-2xl"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-4 bottom-6 p-4 bg-gold text-black rounded-lg disabled:opacity-30 hover:bg-surface-dark transition-all shadow-2xl"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
