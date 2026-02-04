'use server';

/**
 * @fileOverview Extracts keywords from user activity notes using AI.
 *
 * - extractActivityKeywords - A function that takes a note and returns keywords.
 * - ExtractActivityKeywordsInput - The input type for the extractActivityKeywords function.
 * - ExtractActivityKeywordsOutput - The return type for the extractActivityKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActivityKeywordsInputSchema = z.object({
  note: z.string().describe('The note describing the activity performed.'),
});
export type ExtractActivityKeywordsInput = z.infer<typeof ExtractActivityKeywordsInputSchema>;

const ExtractActivityKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('Keywords extracted from the activity note.'),
});
export type ExtractActivityKeywordsOutput = z.infer<typeof ExtractActivityKeywordsOutputSchema>;

export async function extractActivityKeywords(
  input: ExtractActivityKeywordsInput
): Promise<ExtractActivityKeywordsOutput> {
  return extractActivityKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActivityKeywordsPrompt',
  input: {schema: ExtractActivityKeywordsInputSchema},
  output: {schema: ExtractActivityKeywordsOutputSchema},
  prompt: `Extract keywords from the following activity note:

Note: {{{note}}}

Keywords:`,
});

const extractActivityKeywordsFlow = ai.defineFlow(
  {
    name: 'extractActivityKeywordsFlow',
    inputSchema: ExtractActivityKeywordsInputSchema,
    outputSchema: ExtractActivityKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
