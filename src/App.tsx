/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { INITIAL_TICKETS } from './constants';
import { Ticket, ViewType, SystemStatus, TicketStatus, TicketClassification } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import DiagnosticWorkspace from './components/DiagnosticWorkspace';
import ChatInterface from './components/ChatInterface';
import TicketDetailModal from './components/TicketDetailModal';

export default function App() {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('NOMINAL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeStage, setActiveStage] = useState<'hub' | 'registry' | 'chat' | 'library'>('hub');
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(currentTickets => {
        let changed = false;
        const nextTickets = currentTickets.map(ticket => {
          if (ticket.status === 'CLOSED' || ticket.isManualClassification) return ticket;
          
          const hours = (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
          let newClassification: TicketClassification = ticket.classification;

          if (hours >= 12) newClassification = 'CATASTROPHIC';
          else if (hours >= 9) newClassification = 'MAJOR';
          else if (hours >= 6) newClassification = 'MEDIUM';
          else if (hours >= 3) newClassification = 'LIGHT';
          else if (hours >= 1) newClassification = 'SMALL';
          else newClassification = 'SMALL';
          
          if (newClassification !== ticket.classification) {
            changed = true;
            return { ...ticket, classification: newClassification };
          }
          return ticket;
        });
        return changed ? nextTickets : currentTickets;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeTicket = useMemo(() => 
    tickets.find(t => t.id === activeTicketId) || null
  , [tickets, activeTicketId]);

  const editingTicket = useMemo(() => 
    tickets.find(t => t.id === editingTicketId) || null
  , [tickets, editingTicketId]);

  const handleTicketSelect = (id: string) => {
    setActiveTicketId(id);
    if (id) setActiveStage('chat');
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets(prev => [...prev, newTicket]);
    setActiveTicketId(newTicket.id);
    setActiveStage('chat');
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    if (activeTicketId === id) setActiveTicketId(null);
  };

  const toggleStatus = () => {
    const statuses: SystemStatus[] = ['NOMINAL', 'BLEEDING', 'SECURED'];
    const currentIndex = statuses.indexOf(systemStatus);
    setSystemStatus(statuses[(currentIndex + 1) % statuses.length]);
  };

  const handleUpdateTicketStatus = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, status: newStatus, lastUpdate: new Date().toISOString() } : t
    ));
  };

  const handleResolveTicket = (id: string, resolution: string) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'CLOSED', resolution, lastUpdate: new Date().toISOString() } : t
    ));
  };

  const handleUpdateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates, lastUpdate: new Date().toISOString() } : t
    ));
  };

  return (
    <div className="flex h-screen w-full bg-charcoal text-text-main overflow-hidden font-sans">
      <AnimatePresence>
        {editingTicket && (
          <TicketDetailModal 
            isOpen={true}
            ticket={editingTicket}
            onClose={() => setEditingTicketId(null)}
            onSave={handleUpdateTicket}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          status={systemStatus} 
          tickets={tickets}
          activeTicketId={activeTicketId}
          onTicketChange={handleTicketSelect}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onStatusToggle={toggleStatus}
          onDeleteTicket={handleDeleteTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onUpdateTicket={handleUpdateTicket}
          onResolveTicket={handleResolveTicket}
          onEditTicket={(id) => setEditingTicketId(id)}
        />

        <div className="flex-1 overflow-hidden relative">
          <DiagnosticWorkspace 
            ticket={activeTicket}
            tickets={tickets}
            systemStatus={systemStatus}
            activeStage={activeStage}
            onStageChange={setActiveStage}
            onCreateTicket={handleCreateTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onUpdateTicket={handleUpdateTicket}
            onResolveTicket={handleResolveTicket}
            onEditTicket={(id) => setEditingTicketId(id)}
          />
        </div>
      </main>
    </div>
  );
}

