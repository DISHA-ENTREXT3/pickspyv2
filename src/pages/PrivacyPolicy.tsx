import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShieldCheck, Lock, Globe, Eye, FileText } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 hover:bg-white/5">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
                <p className="text-muted-foreground">Last Updated: February 8, 2026</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-12">
              <section className="bg-white/5 p-6 rounded-xl border border-white/5">
                <p className="text-lg leading-relaxed text-slate-300 italic">
                  At PickSpy, we are committed to global data privacy standards, including GDPR, CCPA, and CPRA. This policy outlines how we handle your digital footprint with transparency and respect.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">1. Data We Collect</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <h3 className="text-primary font-bold mb-2">Personal</h3>
                    <p className="text-sm text-slate-400">Name, email, billing details, and profile information provided during signup.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <h3 className="text-primary font-bold mb-2">Technical</h3>
                    <p className="text-sm text-slate-400">IP address, browser type, device identifiers, and operating system metadata.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <h3 className="text-primary font-bold mb-2">Usage</h3>
                    <p className="text-sm text-slate-400">Search queries, analyzed products, feature interactions, and session duration.</p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">2. Legal Basis for Processing</h2>
                </div>
                <p className="text-slate-300 mb-4">We process your data under the following legal frameworks:</p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-white block">Consent</strong>
                      <span className="text-slate-400 text-sm">When you opt-in to marketing emails or specific data tracking features.</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-white block">Contractual</strong>
                      <span className="text-slate-400 text-sm">Necessary to provide the SaaS services you subscribed to.</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-white block">Legitimate Interest</strong>
                      <span className="text-slate-400 text-sm">To improve our AI algorithms, secure our platform, and prevent fraud.</span>
                    </div>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">3. International Data Transfers</h2>
                </div>
                <p className="text-slate-300">
                  PickSpy is a global platform. Your data may be stored and processed in servers located in the United States, Europe, or other regions where our cloud providers operate (e.g., Supabase, Modal). We use Standard Contractual Clauses (SCCs) to ensure your data remains protected regardless of where it is stored.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">4. Your Global Rights</h2>
                </div>
                <p className="text-slate-300 mb-6">Regardless of your location, we provide all users with the following rights:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Right to Access", desc: "Request a copy of all data we hold about you." },
                    { title: "Right to Erasure", desc: "Request that we delete your account and personal data." },
                    { title: "Data Portability", desc: "Download your data in a structured, machine-readable format." },
                    { title: "Right to Rectification", desc: "Correct any inaccurate or incomplete personal information." }
                  ].map((right, i) => (
                    <div key={i} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-bold text-white mb-1">{right.title}</h4>
                      <p className="text-xs text-slate-400">{right.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Retention & Security</h2>
                <p className="text-slate-300">
                  We retain your information for as long as your account is active or as needed to provide services. We implement industry-standard encryption (AES-256) for data at rest and TLS for data in transit. Access to your personal data is restricted to authorized personnel who require it for platform maintenance.
                </p>
              </section>

              <section className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Our Privacy Team</h2>
                <p className="text-slate-300">
                  For any privacy-related requests or questions about GDPR/CCPA compliance, please contact our Data Protection Officer at:
                  <br />
                  <a href="mailto:business@entrext.in" className="text-primary hover:underline font-bold mt-2 inline-block">business@entrext.in</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
