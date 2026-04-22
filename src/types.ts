/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewType = 'kanban' | 'workspace' | 'assistant';

export type TicketStatus = 'OPEN' | 'IN-PROGRESS' | 'CLOSED';

export type TicketClassification = 'SMALL' | 'LIGHT' | 'MEDIUM' | 'MAJOR' | 'CATASTROPHIC';

export type SystemStatus = 'NOMINAL' | 'BLEEDING' | 'SECURED';

export type MessageSource = 'EDGE' | 'CLOUD' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'ai' | 'user' | 'system';
  source?: MessageSource;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  latency: string;
  messageCount: number;
  lastUpdate: string;
  createdAt: string;
  classification: TicketClassification;
  isManualClassification?: boolean;
  faultType: string;
  faultLocation: string;
  engineerProposedSolution?: string;
  resolution?: string;
  resolutionAttachments?: string[];
  attachments?: string[];
  rigLocation?: string;
  holeDepth?: string;
  supervisorName?: string;
}

export interface TelemetryData {
  shuntCurrent: number;
  rscStatus: 'ok' | 'error';
  rsxStatus: 'ok' | 'error';
  pscDetector: 'ok' | 'error';
  temperature: number;
  latencyDb: number;
}
