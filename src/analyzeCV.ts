import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, type ModelMessage } from "ai";
import path from "node:path";
import fs from "node:fs"
import z from "zod";

const feedbackSchema = z.object({
  feedback: z.string().describe('Concise feedback on what can be improved (maximum 3 main points)'),
  score: z.number().min(1).max(10).describe('Score from 1 to 10')
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

export async function analyzeCV(pdfPath: string) {
  if (!fs.existsSync(pdfPath)) throw Error(`CV not found at: ${pdfPath}`);

  const pdfBuffer = fs.readFileSync(pdfPath);
  
  const userMessage: ModelMessage = {
    role: 'user',
    content: [
      {
        type: 'text',
        text: `Analyze this resume PDF and provide structured feedback.`,
      },
      {
        type: 'file',
        data: pdfBuffer,
        mediaType: 'application/pdf',
        filename: path.basename(pdfPath),
      },
    ],
  }

  const result = await generateObject({
    model: google('gemini-2.5-flash'),
    messages: [userMessage],
    system: `You are an HR specialist who analyzes resumes. 
    Provide direct and constructive feedback on possible improvements and a score from 1 to 10.`,
    schema: feedbackSchema,
    maxRetries: 2
  });

  return result.object;
}