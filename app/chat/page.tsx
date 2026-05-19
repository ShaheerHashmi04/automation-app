"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STEPS = [
  { label: "About your business", desc: "What you do" },
  { label: "Identify manual task", desc: "What to automate" },
  { label: "Tools you use", desc: "Your current software" },
  { label: "Get your plan", desc: "Your automation plan" },
];

function getStep(messages: Message[]): number {
  const userMessages = messages.filter((m) => m.role === "user").length;
  if (userMessages === 0) return 0;
  if (userMessages === 1) return 1;
  if (userMessages === 2) return 2;
  return 3;
}

function extractAutomation(text: string): string | null {
  const match = text.match(/<automation>([\s\S]*?)<\/automation>/);
  return match ? match[1] : null;
}

function downloadPlan(text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "automation-plan.txt";
  a.click();
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your automation consultant. What does your business do?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentStep = getStep(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: "assistant", content: data.text }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">

      {/* Sidebar */}
      <div className="w-56 border-r border-gray-100 flex flex-col px-4 py-5 bg-gray-50 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-7 hover:opacity-70 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1L11.5 6.5H17L12.5 10L14.5 16L9 12.5L3.5 16L5.5 10L1 6.5H6.5L9 1Z" fill="#374151" />
          </svg>
          <span className="text-sm font-medium text-gray-800">AutoConsult</span>
        </Link>

        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Your progress</p>
        <div className="flex flex-col">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const pending = i > currentStep;
            return (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                    ${done ? "bg-green-600 text-white" : ""}
                    ${active ? "bg-white border border-gray-300 text-gray-700" : ""}
                    ${pending ? "bg-gray-100 border border-gray-200 text-gray-400" : ""}
                  `}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (i + 1)}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-px h-6 mt-1 ${done ? "bg-green-200" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-xs font-medium leading-5 ${pending ? "text-gray-400" : "text-gray-700"}`}>
                    {step.label}
                  </p>
                  {(done || active) && (
                    <p className="text-xs text-gray-400 leading-4">{step.desc}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Free · No signup needed</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 7H1M1 7L6 2M1 7L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>
            <div>
              <p className="text-sm font-medium text-gray-800">Automation consultant</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Step {Math.min(currentStep + 1, 4)} of 4 — {STEPS[Math.min(currentStep, 3)].label.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Active
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {messages.map((msg, i) => {
            const automation = msg.role === "assistant" ? extractAutomation(msg.content) : null;
            const displayText = msg.content.replace(/<automation>[\s\S]*?<\/automation>/, "").trim();

            return (
              <div key={i} className={`flex gap-2.5 items-start max-w-[80%] ${msg.role === "user" ? "self-end flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                  ${msg.role === "assistant" ? "bg-gray-100 text-gray-500 border border-gray-200" : "bg-blue-100 text-blue-700"}
                `}>
                  {msg.role === "assistant" ? "AI" : "U"}
                </div>

                <div>
                  <div className={`px-3.5 py-2.5 text-sm leading-relaxed
                    ${msg.role === "assistant"
                      ? "bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm text-gray-800"
                      : "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                    }
                  `}>
                    <p className="whitespace-pre-wrap">{displayText}</p>
                  </div>

                  {automation && (
                    <div className="mt-2 p-3.5 bg-white border border-green-200 rounded-xl">
                      <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Your automation plan is ready
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{automation}</p>
                      <button
                        onClick={() => downloadPlan(automation)}
                        className="mt-2.5 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1V8M6 8L3.5 5.5M6 8L8.5 5.5M2 10H10" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-start max-w-[80%]">
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">AI</div>
              <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <input
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder-gray-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-colors flex items-center gap-2"
          >
            Send
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6H11M11 6L7 2M11 6L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}