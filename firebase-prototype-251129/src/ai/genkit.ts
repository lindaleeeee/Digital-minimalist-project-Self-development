/**
 * @file genkit.ts
 * @description Configuration entry point for Firebase Genkit.
 * Configures the Google AI plugin with Gemini models.
 *
 * @usage
 * Used by server actions (e.g., extract-activity-keywords) to perform LLM inference.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
