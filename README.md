# AutoConsult — AI Business Automation Consultant

A full-stack AI consultant that helps small business owners identify and automate repetitive tasks through natural conversation. Sign up, fill out your business profile, chat with the AI, and walk away with a personalized downloadable PDF automation plan — all conversations saved to your account.

🔗 **[Try it live → automation-app-umber.vercel.app](https://automation-app-umber.vercel.app/)**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=flat&logo=groq&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

**Features:** Conversational AI via Groq, business info modal on new chat, personalized PDF report generation with jsPDF, full user auth with Supabase, persistent multi-session chat history, forgot/reset password flow, protected routes via Next.js middleware, deployed on Vercel.

**Run locally:** Clone the repo, run `npm install`, add your `GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then run `npm run dev`.

**Project Structure:**
```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout
├── auth/
│   ├── login/
│   │   └── page.tsx      # Login, signup and forgot password
│   └── reset-password/
│       └── page.tsx      # Password reset page
├── chat/
│   └── page.tsx          # Chat interface with history sidebar
└── api/
    └── chat/
        └── route.ts      # Groq API integration
lib/
├── supabase.ts           # Supabase browser client
└── generatePDF.ts        # jsPDF personalized report generator
middleware.ts             # Auth route protection
```

Built by [Shaheer Hashmi](https://github.com/ShaheerHashmi04)
