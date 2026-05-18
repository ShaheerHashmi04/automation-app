import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

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
  role: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ text: "Missing API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages }: { messages: Message[] } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // Filter history to only include messages after the first user message
    // and exclude the last message (which we send separately)
    const allButLast = messages.slice(0, -1);
    const firstUserIndex = allButLast.findIndex((m) => m.role === "user");
    const validHistory = firstUserIndex === -1 ? [] : allButLast.slice(firstUserIndex);

    const history = validHistory.map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return Response.json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json({ text: "Sorry, something went wrong. Please try again." });
  }
}