"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const industries = [
  "Bakeries", "E-commerce stores", "Freelancers", "Restaurants",
  "Agencies", "Law firms", "Real estate", "Fitness studios",
  "Consultants", "Clinics", "Photography studios", "Accountants"
];

const plans: Record<string, string[]> = {
  "Bakeries": [
    "Set up a Google Form for customer orders linked to a Google Sheet",
    "Use Zapier to send a confirmation email when a new order comes in",
    "Add a Slack notification so your team is alerted in real time",
    "Use conditional logic to flag large or urgent orders for manual review",
  ],
  "E-commerce stores": [
    "Connect Shopify to a Google Sheet to track all orders automatically",
    "Use Zapier to send abandoned cart emails after 1 hour of inactivity",
    "Auto-generate weekly sales reports and email them to yourself",
    "Set up low stock alerts when inventory drops below a threshold",
  ],
  "Freelancers": [
    "Use Calendly to automate client booking and send confirmation emails",
    "Connect your invoicing tool to auto-send invoices when a project closes",
    "Set up a weekly time tracking summary sent to your email every Friday",
    "Auto-follow up with leads who haven't responded in 3 days",
  ],
  "Restaurants": [
    "Set up an online order form that feeds into a central Google Sheet",
    "Auto-send reservation confirmations and reminders via email or SMS",
    "Use Zapier to notify kitchen staff of new orders via Slack or email",
    "Track daily revenue automatically and get a summary every evening",
  ],
  "Agencies": [
    "Auto-create a project folder in Google Drive when a new client signs",
    "Use Zapier to assign tasks in Asana when a new deal closes in your CRM",
    "Send automated weekly status update emails to all active clients",
    "Auto-generate and send invoices on a recurring monthly schedule",
  ],
  "Law firms": [
    "Auto-send intake forms to new clients as soon as they book a consultation",
    "Set up document templates that auto-fill with client details",
    "Use Zapier to create calendar reminders for upcoming court dates",
    "Auto-log all client communications into your case management system",
  ],
  "Real estate": [
    "Auto-send property listings to leads based on their saved preferences",
    "Use Zapier to notify you instantly when a new lead fills out a form",
    "Schedule automated follow-up emails for leads who went cold",
    "Auto-generate a weekly pipeline report from your CRM data",
  ],
  "Fitness studios": [
    "Use Calendly or Mindbody to automate class bookings and reminders",
    "Auto-send a welcome email sequence to new members when they sign up",
    "Set up automated payment reminders 3 days before membership renewal",
    "Track attendance automatically and flag members who haven't visited",
  ],
  "Consultants": [
    "Automate your discovery call booking with Calendly and confirmation emails",
    "Use Zapier to create a project brief doc when a new client pays",
    "Auto-send weekly progress updates to clients from a template",
    "Set up automated invoice reminders for overdue payments",
  ],
  "Clinics": [
    "Auto-send appointment reminders via email or SMS 24 hours before",
    "Use a form to collect patient intake info before their first visit",
    "Auto-follow up with patients who missed their appointment",
    "Track no-show rates automatically in a Google Sheet dashboard",
  ],
  "Photography studios": [
    "Auto-send a welcome packet and questionnaire when a client books",
    "Use Zapier to create a client folder in Google Drive automatically",
    "Send automated gallery delivery emails with a download link",
    "Set up payment reminder emails 7 days before the shoot date",
  ],
  "Accountants": [
    "Auto-send document request checklists to clients at tax season",
    "Use Zapier to log all received documents into a tracking spreadsheet",
    "Set up automated deadline reminder emails for each client",
    "Auto-generate and send monthly financial summary reports",
  ],
};

const defaultPlan = plans["Bakeries"];

export default function Home() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentPlan = selectedIndustry ? plans[selectedIndustry] : defaultPlan;
  const planLabel = selectedIndustry ?? "Bakeries";
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee { animation: marquee 30s linear infinite; }
        .marquee-reverse { animation: marquee-reverse 30s linear infinite; }
        .fade-edges {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
        }
      `}</style>

      {/* Dark header + hero */}
      <div className="bg-gray-900">
        <nav className="flex items-center justify-between px-8 py-5">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L11.5 6.5H17L12.5 10L14.5 16L9 12.5L3.5 16L5.5 10L1 6.5H6.5L9 1Z" fill="white" />
            </svg>
            <span className="text-sm font-medium text-white">AutoConsult</span>
          </Link>
          <Link
            href={isLoggedIn ? "/chat" : "/auth/login"}
            className="text-sm px-4 py-2 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            {isLoggedIn ? "Go to chat" : "Get started"}
          </Link>
        </nav>

        <div className="flex flex-col items-center text-center px-6 pt-10 pb-6">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/10 text-gray-300 border border-white/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Free · No signup needed
          </div>
          <h1 className="text-5xl font-medium text-white leading-tight max-w-2xl mb-5">
            Automate your business in minutes
          </h1>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-8">
            Describe your business to our AI and receive a personalized, step-by-step automation plan tailored to your tools and workflow — no technical knowledge required.
          </p>
          <Link
            href={isLoggedIn ? "/chat" : "/auth/login"}
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors mb-3"
          >
            {isLoggedIn ? "Continue to chat" : "Build my automation plan"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="text-xs text-gray-500 mb-10">Takes about 5 minutes</p>

          {/* Stats bar */}
          <div className="grid grid-cols-3 w-full max-w-md border border-white/10 rounded-2xl overflow-hidden mb-10">
            {[
              { num: "5 min", label: "Average time" },
              { num: "12", label: "Industries covered" },
              { num: "100%", label: "Free to use" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`py-4 text-center ${i < 2 ? "border-r border-white/10" : ""}`}
              >
                <p className="text-lg font-medium text-white">{stat.num}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social proof sliders */}
      <div className="py-14 bg-white">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-8">
          Leading companies that run on automation
        </p>
        <div className="fade-edges overflow-hidden max-w-4xl mx-auto mb-12">
          <div className="flex gap-10 whitespace-nowrap marquee">
            {[
              { name: "Google", color: "#4285F4", bg: "#EAF1FF" },
              { name: "Amazon", color: "#FF9900", bg: "#FFF4E0" },
              { name: "Meta", color: "#0866FF", bg: "#EAF2FF" },
              { name: "Tesla", color: "#CC0000", bg: "#FFEBEB" },
              { name: "Shopify", color: "#96BF48", bg: "#F3F9EA" },
              { name: "Nvidia", color: "#76B900", bg: "#F2FAE6" },
              { name: "Microsoft", color: "#00A4EF", bg: "#E6F6FF" },
              { name: "Apple", color: "#555555", bg: "#F5F5F5" },
              { name: "Salesforce", color: "#00A1E0", bg: "#E6F7FF" },
              { name: "Netflix", color: "#E50914", bg: "#FFEBEC" },
              { name: "Google", color: "#4285F4", bg: "#EAF1FF" },
              { name: "Amazon", color: "#FF9900", bg: "#FFF4E0" },
              { name: "Meta", color: "#0866FF", bg: "#EAF2FF" },
              { name: "Tesla", color: "#CC0000", bg: "#FFEBEB" },
              { name: "Shopify", color: "#96BF48", bg: "#F3F9EA" },
              { name: "Nvidia", color: "#76B900", bg: "#F2FAE6" },
              { name: "Microsoft", color: "#00A4EF", bg: "#E6F6FF" },
              { name: "Apple", color: "#555555", bg: "#F5F5F5" },
              { name: "Salesforce", color: "#00A1E0", bg: "#E6F7FF" },
              { name: "Netflix", color: "#E50914", bg: "#FFEBEC" },
            ].map((company, i) => (
              <div key={i} className="inline-flex flex-col items-center gap-2.5 shrink-0">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: company.bg, color: company.color }}
                >
                  {company.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-600">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12" />

        <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-8">
          Popular tools used in automation workflows
        </p>
        <div className="fade-edges overflow-hidden max-w-4xl mx-auto">
          <div className="flex gap-4 whitespace-nowrap marquee-reverse">
            {[
              { name: "Zapier", bg: "#FFF0EB", color: "#FF4A00", letter: "Z" },
              { name: "Slack", bg: "#F4EEF4", color: "#4A154B", letter: "S" },
              { name: "Google Sheets", bg: "#E8F5EE", color: "#0F9D58", letter: "G" },
              { name: "Notion", bg: "#F5F5F5", color: "#374151", letter: "N" },
              { name: "HubSpot", bg: "#FFF3EF", color: "#FF7A59", letter: "H" },
              { name: "Make", bg: "#F3EAFF", color: "#6D00CC", letter: "M" },
              { name: "Gmail", bg: "#FEECEB", color: "#EA4335", letter: "G" },
              { name: "Stripe", bg: "#EEEEFF", color: "#635BFF", letter: "S" },
              { name: "Zapier", bg: "#FFF0EB", color: "#FF4A00", letter: "Z" },
              { name: "Slack", bg: "#F4EEF4", color: "#4A154B", letter: "S" },
              { name: "Google Sheets", bg: "#E8F5EE", color: "#0F9D58", letter: "G" },
              { name: "Notion", bg: "#F5F5F5", color: "#374151", letter: "N" },
              { name: "HubSpot", bg: "#FFF3EF", color: "#FF7A59", letter: "H" },
              { name: "Make", bg: "#F3EAFF", color: "#6D00CC", letter: "M" },
              { name: "Gmail", bg: "#FEECEB", color: "#EA4335", letter: "G" },
              { name: "Stripe", bg: "#EEEEFF", color: "#635BFF", letter: "S" },
            ].map((tool, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-gray-200 bg-white shrink-0"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: tool.bg, color: tool.color }}
                >
                  {tool.letter}
                </div>
                <span className="text-sm font-medium text-gray-800">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-3">How it works</p>
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Four steps to your automation plan</h2>
          <p className="text-sm text-gray-500 text-center mb-10">No technical knowledge needed — just answer a few questions.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-purple-50 p-6 flex flex-col gap-3">
              <span className="text-xs font-medium text-purple-600">01</span>
              <h3 className="text-sm font-medium text-purple-900">Describe your business</h3>
              <p className="text-xs text-purple-700 leading-relaxed">Tell us what your business does in one sentence.</p>
            </div>
            <div className="bg-teal-50 p-6 flex flex-col gap-3">
              <span className="text-xs font-medium text-teal-600">02</span>
              <h3 className="text-sm font-medium text-teal-900">Identify the pain</h3>
              <p className="text-xs text-teal-700 leading-relaxed">Share the most repetitive task eating up your time.</p>
            </div>
            <div className="bg-amber-50 p-6 flex flex-col gap-3">
              <span className="text-xs font-medium text-amber-600">03</span>
              <h3 className="text-sm font-medium text-amber-900">Your current tools</h3>
              <p className="text-xs text-amber-700 leading-relaxed">Tell us what software and tools you already use.</p>
            </div>
            <div className="bg-blue-50 p-6 flex flex-col gap-3">
              <span className="text-xs font-medium text-blue-600">04</span>
              <h3 className="text-sm font-medium text-blue-900">Get your plan</h3>
              <p className="text-xs text-blue-700 leading-relaxed">Download a custom automation plan built for you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-3">Why automation</p>
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Stop doing the same thing twice</h2>
          <p className="text-sm text-gray-500 text-center mb-10">
            Every hour spent on repetitive tasks is an hour not spent growing your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V8L11 11" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="8" r="6.5" stroke="#7C3AED" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-800">Save hours every week</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Businesses that automate repetitive tasks save an average of 6 hours per week — time you can put back into growing your business.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-800">Eliminate human error</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manual processes are prone to mistakes. Automation runs the same way every single time — no missed emails, no forgotten follow-ups, no data entry errors.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 10L8 4L11 7L14 2" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-800">Scale without hiring</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Automation lets your business handle more customers, orders, and requests without adding headcount — so you grow without the overhead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industries + Live Plan Preview */}
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-3">Built for every business</p>
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Whatever you run, we can help</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Click your industry to see a sample automation plan.</p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
                  ${selectedIndustry === industry
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
                  }`}
              >
                {industry}
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs font-medium text-green-700">Sample plan for {planLabel}</p>
            </div>
            {currentPlan.map((item, i) => (
              <div key={i} className="flex gap-3 items-start mb-3">
                <div className="w-4 h-4 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Example output — yours will be tailored to your business</p>
              <Link
                href={isLoggedIn ? "/chat" : "/auth/login"}
                className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
              >
                Get mine
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6H11M11 6L7 2M11 6L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center text-center px-6 py-16 bg-gray-900">
        <h2 className="text-2xl font-medium text-white mb-4">Ready to save time?</h2>
        <p className="text-sm text-gray-400 mb-8">
          Join other small businesses automating their workflows with AutoConsult.
        </p>
        <Link
          href={isLoggedIn ? "/chat" : "/auth/login"}
          className="flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isLoggedIn ? "Continue to chat" : "Get started for free"}
          
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center px-8 py-6 border-t border-gray-800 bg-gray-900">
        <p className="text-xs text-gray-500">
          Built by{" "}
          <a href="https://github.com/ShaheerHashmi04" className="text-gray-400 hover:text-white transition-colors">
            Shaheer Hashmi
          </a>
        </p>
      </div>

    </div>
  );
}