/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageSource, Ticket } from "../types";

let aiInstance: any = null;

async function getAI() {
  if (aiInstance) return aiInstance;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      return null;
    }

    // Dynamic import to prevent any top-level SDK load issues
    const { GoogleGenAI } = await import("@google/genai");
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  } catch (e) {
    console.warn("AI initialization suppressed for offline mode:", e);
    return null;
  }
}

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

  const ai = await getAI();
  
  if (!ai) {
    // OFFLINE FALLBACK: Provide a high-fidelity simulated response
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    return {
      text: `## SOVEREIGN_EDGE // DIAGNOSTIC_OFFLINE\n\nCloud Core synchronization is currently **DEFERRED**. Local diagnostic cache active.\n\n### Potential Resolution Vectors:\n- **Node Parity**: Verify SnR sync in Rig Segment 04.\n- **Maintenance**: Review department manual [OnG_1.pdf] for high-voltage isolation protocols.\n- **RSC Calibration**: Perform manual telemetry sweep if signal drift exceeds 1.45A.`,
      source: 'EDGE'
    };
  }

  try {
    const chatModel = ai.getGenerativeModel({ model });
    const result = await chatModel.generateContent(message);
    const response = await result.response;
    
    return {
      text: response.text() || "Signal weak. Retry requested.",
      source: 'CLOUD'
    };
  } catch (error) {
    console.warn("AI execution failed, falling back to edge:", error);
    return {
      text: "Connection to Sovereign Core interrupted. Initiating local cache sweep...",
      source: 'EDGE'
    };
  }
}
