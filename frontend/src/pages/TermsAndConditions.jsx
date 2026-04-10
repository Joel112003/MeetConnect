import React from "react";
import { useNavigate } from "react-router-dom";
import meetConnectLogo from "../assets/images/MeetConnect.png";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#040b18] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081427]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
            </span>
            <span className="text-sm font-semibold tracking-tight">MeetConnect</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
          >
            Back to Home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-white/55">Last updated: April 10, 2026</p>

        <div className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-[#0a1326]/85 p-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By using this platform, you agree to these terms and all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">2. User Responsibilities</h2>
            <p>You agree to provide accurate account details, protect your credentials, and use the service only for lawful and authorized purposes.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">3. Prohibited Conduct</h2>
            <p>Abuse, harassment, unauthorized access, or activities that disrupt platform reliability are strictly prohibited.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">4. Service Availability</h2>
            <p>We aim for high availability but do not guarantee uninterrupted service. Maintenance and outages may occur.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">5. Limitation of Liability</h2>
            <p>To the extent permitted by law, the platform is provided as-is, without warranties of any kind, and liability is limited for indirect losses.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">6. Changes to Terms</h2>
            <p>We may update these terms periodically. Continued use after updates indicates acceptance of the revised terms.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
