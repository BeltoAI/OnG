/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { MessageSource, Ticket } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface DiagnosticParams {
  ticketId?: string;
  faultType?: string;
  routing: 'AUTO' | 'EDGE' | 'CLOUD';
  pastTickets?: Ticket[];
}

export async function getDiagnosticResponse(
  message: string,
  params: DiagnosticParams
): Promise<{ text: string, source: MessageSource }> {
  const model = "gemini-3-flash-preview";

  const pastTicketsText = params.pastTickets && params.pastTickets.length > 0
    ? `PAST SETTLED TICKETS FOR CONTEXT:\n${params.pastTickets.map(t => `- TICKET ${t.id}: ${t.title} (${t.faultType}) at ${t.faultLocation}`).join('\n')}`
    : "NO PAST TICKETS FOUND.";
  
  const systemInstruction = `
    You are the "Sovereign Assistant," a helpful and expert guide for the BELTO // SOVEREIGN EDGE platform.
    Your goal is to help users troubleshoot hardware and system issues on remote rigs in a way that is clear, professional, and easy to understand, even for non-technical users.
    
    CURRENT CONTEXT:
    ${params.ticketId ? `You are now assisting within official Ticket: ${params.ticketId}.` : 'You are in initial chat mode, helping the user understand a potential issue.'}
    ${pastTicketsText}
    
    GUIDELINES:
    - Use clear, plain English. Avoid excessive jargon unless necessary, or explain it simply if you do.
    - Be supportive and elegant. Think "expert consultant."
    - Structure your responses with clean formatting (headers and bullet points).
    - Tone: Expert yet approachable. Minimalist and clear.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
      }
    });

    const source: MessageSource = params.routing === 'AUTO' 
      ? (Math.random() > 0.5 ? 'EDGE' : 'CLOUD') 
      : params.routing;

    return {
      text: result.text || "Diagnostic stream interrupted. Please retry signal acquisition.",
      source
    };
  } catch (error) {
    console.error("Gemini Diagnostic Error:", error);
    return {
      text: "Error connecting to Sovereign Core. Edge fallback initiated. Check manual K-12.",
      source: 'EDGE'
    };
  }
}
