/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket } from './types';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TICKET-001',
    title: 'FPSR Fault - Sector 4',
    status: 'IN-PROGRESS',
    latency: '14ms',
    messageCount: 12,
    lastUpdate: '2 mins ago',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
    classification: 'SMALL',
    faultType: 'FPSR High Voltage Trip',
    faultLocation: 'Rig 12 / Sector 4',
    resolution: 'Reset capacitor bank and updated firmware for Sector 4 power coupling.',
    attachments: ['https://picsum.photos/seed/elec/800/600'],
  },
  {
    id: 'TICKET-002',
    title: 'Resistivity Tool Timeout',
    status: 'OPEN',
    latency: '8ms',
    messageCount: 0,
    lastUpdate: '10 mins ago',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
    classification: 'MAJOR',
    faultType: 'Resistivity SNR Low',
    faultLocation: 'Rig 08 / Depth 12k',
    attachments: ['https://picsum.photos/seed/drill/800/600'],
  },
  {
    id: 'TICKET-003',
    title: 'PSC Detector Anomaly',
    status: 'CLOSED',
    latency: '45ms',
    messageCount: 22,
    lastUpdate: '1 hour ago',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    classification: 'CATASTROPHIC',
    faultType: 'PSC Filter Saturation',
    faultLocation: 'Rig 15 / Offshore',
    resolution: 'Replaced saturated PSC detector and re-calibrated the rig signal trace.',
    attachments: ['https://picsum.photos/seed/psc/800/600'],
    resolutionAttachments: ['https://picsum.photos/seed/fixpsc/800/600'],
  },
  {
    id: 'TICKET-004',
    title: 'Drill Bit Heat Spike',
    status: 'OPEN',
    latency: '5ms',
    messageCount: 0,
    lastUpdate: 'Just now',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    classification: 'SMALL',
    faultType: 'Bit Temp Over Limit',
    faultLocation: 'Rig 03 / Sector 1',
    attachments: ['https://picsum.photos/seed/heat/800/600'],
  },
];

export const MOCK_TELEMETRY = {
  shuntCurrent: 1.45,
  rscStatus: 'ok' as const,
  rsxStatus: 'error' as const,
  pscDetector: 'ok' as const,
  temperature: 184.2,
  latencyDb: -12.4,
};
