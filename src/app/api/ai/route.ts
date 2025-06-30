import { NextRequest, NextResponse } from 'next/server';
import { BusinessRule } from '../../../types/rules';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ message: 'No prompt provided.' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: 'OpenAI API key not set.' }, { status: 500 });
  }

  // Compose a system prompt to instruct the AI to return a rule in JSON
  const systemPrompt = `
You are an expert in data validation and business rules. 
Given a user's description, generate a business rule as a JSON object with the following fields:
{
  "name": string,
  "description": string,
  "type": "validation" | "transformation" | "constraint",
  "status": "active" | "inactive" | "draft",
  "priority": "low" | "medium" | "high",
  "conditions": string[],
  "actions": string[]
}
Only return the JSON object, nothing else.
`;

  const userPrompt = `User description: "${prompt}"`;

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 512,
      }),
    });

    const data = await completion.json();
    const content = data.choices?.[0]?.message?.content;

    // Try to parse the JSON from the AI's response
    let rule: Partial<BusinessRule> | null = null;
    if (content) {
      try {
        // Find the first {...} block in the response
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          rule = JSON.parse(match[0]);
        }
      } catch (e) {
        // fallback: return the raw content
        return NextResponse.json({ message: 'Failed to parse AI response.', raw: content }, { status: 500 });
      }
    }

    if (rule) {
      return NextResponse.json({ rule });
    } else {
      return NextResponse.json({ message: 'AI did not return a valid rule.', raw: content }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ message: 'Failed to contact OpenAI.', error: String(e) }, { status: 500 });
  }
} 