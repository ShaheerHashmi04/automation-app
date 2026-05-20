"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (data) {
      setConversations(data);
      if (data.length > 0) {
        loadConversation(data[0].id);
      } else {
        startNewChat();
      }
    } else {
      startNewChat();
    }
    setLoadingConversations(false);
  };

  const loadConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (data && data.length > 0) {
      setMessages(data.map((m) => ({ role: m.role, content: m.content })));
    } else {
      setMessages([{
        role: "assistant",
        content: "Hi! I'm your automation consultant. What does your business do?",
      }]);
    }
  };

  const startNewChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: "New conversation" })
      .select()
      .single();

    if (data) {
      setConversations((prev) => [data, ...prev]);
      setActiveConversationId(data.id);
      setMessages([{
        role: "assistant",
        content: "Hi! I'm your automation consultant. What does your business do?",
      }]);
    }
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role,
      content,
    });
  };

  const updateConversationTitle = async (conversationId: string, firstUserMessage: string) => {
    const title = firstUserMessage.length > 40
      ? firstUserMessage.substring(0, 40) + "..."
      : firstUserMessage;

    await supabase
      .from("conversations")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    setConversations((prev) =>
      prev.map((c) => c.id === conversationId ? { ...c, title } : c)
    );
  };

  const deleteConversation = async (conversationId: string) => {
    await supabase.from("conversations").delete().eq("id", conversationId);
    const remaining = conversations.filter((c) => c.id !== conversationId);
    setConversations(remaining);

    if (activeConversationId === conversationId) {
      if (remaining.length > 0) {
        loadConversation(remaining[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeConversationId) return;

    const userMessage = input;
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    await saveMessage(activeConversationId, "user", userMessage);

    const userMessageCount = newMessages.filter((m) => m.role === "user").length;
    if (userMessageCount === 1) {
      await updateConversationTitle(activeConversationId, userMessage);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    const assistantMessage = data.text;

    setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
    await saveMessage(activeConversationId, "assistant", assistantMessage);

    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", activeConversationId);

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">

      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-gray-900 shrink-0">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L11.5 6.5H17L12.5 10L14.5 16L9 12.5L3.5 16L5.5 10L1 6.5H6.5L9 1Z" fill="white" />
            </svg>
            <span className="text-sm font-medium text-white">AutoConsult</span>
          </Link>
        </div>

        {/* New chat button */}
        <div className="px-3 py-3">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white text-gray-900 text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New chat
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {loadingConversations ? (
            <p className="text-xs text-gray-500 px-2 py-4 text-center">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-gray-500 px-2 py-4 text-center">No conversations yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-500 uppercase tracking-widest px-2 py-2">Recent</p>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeConversationId === conv.id
                      ? "bg-white/10 border border-white/20 text-white"
                      : "hover:bg-white/10 text-gray-400 hover:text-white"
                  }`}
                  onClick={() => loadConversation(conv.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(conv.updated_at)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all shrink-0"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-xs px-3 py-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-900 bg-gray-900 text-sm text-white hover:bg-gray-700 hover:border-gray-700 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 7H1M1 7L6 2M1 7L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>
            <div>
              <p className="text-sm font-medium text-gray-800">Automation consultant</p>
              <p className="text-xs text-gray-400 mt-0.5">AI powered business automation</p>
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
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0
                  ${msg.role === "assistant" ? "bg-gray-100 text-gray-500 border border-gray-200" : "bg-gray-900 text-white"}
                `}>
                  {msg.role === "assistant" ? "AI" : "U"}
                </div>

                <div>
                  <div className={`px-3.5 py-2.5 text-sm leading-relaxed
                    ${msg.role === "assistant"
                      ? "bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm text-gray-800"
                      : "bg-gray-900 text-white rounded-2xl rounded-tr-sm"
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
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 shrink-0">AI</div>
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
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder-gray-400"
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