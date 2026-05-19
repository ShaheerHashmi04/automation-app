import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are a friendly business automation consultant.
Your job is to help small business owners automate repetitive tasks.
Follow these steps in order:
1. Ask what their business does (one sentence)
2. Ask what their most repetitive manual task is
3. Ask what tools/software they currently use
4. Give them a clear step by step automation plan

Ask only ONE question at a time. Keep responses short and friendly.
When you have enough info, write the automation plan between <automation> and </automation> tags.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ text: "Missing API key" }, { status: 500 });
    }

    const { messages }: { messages: Message[] } = await request.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content ?? "Sorry, something went wrong.";
    return Response.json({ text });

  } catch (error) {
    console.error("Groq API error:", error);
    return Response.json({ text: "Sorry, something went wrong. Please try again." });
  }
}