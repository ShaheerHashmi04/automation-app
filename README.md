# AutoConsult — AI Business Automation Consultant

A full-stack AI-powered consultant that helps small business owners identify and automate their most repetitive manual tasks. Built with Next.js, TypeScript, Tailwind CSS, Groq API, and Supabase.

🔗 **[Try it live → automation-app-umber.vercel.app](https://automation-app-umber.vercel.app/)**

---

## What it does

AutoConsult lets business owners sign up, log in, and have a natural AI-driven conversation about their business. The AI asks follow-up questions, identifies repetitive tasks, and delivers a custom step-by-step automation plan they can download. All conversations are saved and accessible from a persistent chat history sidebar.

---

## Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=flat&logo=groq&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## Features

- Conversational AI powered by Groq (Llama 3.3) that asks natural follow-up questions
- Full user authentication — sign up, login, logout, protected routes
- Persistent conversation history saved to Supabase per user
- Multiple chat sessions with the ability to create and delete conversations
- Downloadable automation plan delivered at the end of each conversation
- Interactive landing page with industry-specific plan previews
- Clean minimal UI with dark navy sidebar matching landing page design
- Serverless API routes with Next.js App Router

---

## Run locally

```bash
git clone https://github.com/ShaheerHashmi04/automation-app.git
cd automation-app
npm install
```

Create a `.env.local` file in the root:

GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Get your free API keys at:
- [console.groq.com](https://console.groq.com)
- [supabase.com](https://supabase.com)

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000)

---

## Project Structure

app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout
├── auth/
│   └── login/
│       └── page.tsx      # Login and signup page
├── chat/
│   └── page.tsx          # Main chat interface with history sidebar
└── api/
└── chat/
└── route.ts      # Groq API integration
lib/
└── supabase.ts           # Supabase client
middleware.ts             # Auth route protection

---

Built by [Shaheer Hashmi](https://github.com/ShaheerHashmi04)