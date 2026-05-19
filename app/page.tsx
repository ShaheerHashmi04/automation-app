import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1L11.5 6.5H17L12.5 10L14.5 16L9 12.5L3.5 16L5.5 10L1 6.5H6.5L9 1Z" fill="#374151" />
          </svg>
          <span className="text-sm font-medium text-gray-800">AutoConsult</span>
        </Link>
        <Link
          href="/chat"
          className="text-sm px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          Get started
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Free · No signup needed
        </div>

        <h1 className="text-5xl font-medium text-gray-900 leading-tight max-w-2xl mb-5">
          Automate your business in minutes
        </h1>

        <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
          Tell our AI about your business and walk away with a custom step-by-step automation plan — no technical knowledge required.
        </p>

        <Link
          href="/chat"
          className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
        >
          Build my automation plan
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <p className="text-xs text-gray-400 mt-4">Takes about 5 minutes</p>
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto px-6 py-16 border-t border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-10">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Describe your business", desc: "Tell us what your business does in one sentence." },
            { step: "02", title: "Identify the pain", desc: "Share the most repetitive task eating up your time." },
            { step: "03", title: "Your current tools", desc: "Tell us what software and tools you already use." },
            { step: "04", title: "Get your plan", desc: "Download a custom automation plan built for you." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-xs font-medium text-gray-400">{item.step}</span>
              <h3 className="text-sm font-medium text-gray-800 leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center text-center px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Ready to save time?</h2>
        <p className="text-sm text-gray-500 mb-8">Join other small businesses automating their workflows with AutoConsult.</p>
        <Link
          href="/chat"
          className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
        >
          Get started for free
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center px-8 py-6 border-t border-gray-100">
        <p className="text-xs text-gray-400">Built by <a href="https://github.com/ShaheerHashmi04" className="text-gray-600 hover:underline">Shaheer Hashmi</a></p>
      </div>

    </div>
  );
}