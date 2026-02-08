import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info, RefreshCcw, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RefundPolicy() {
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
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Disclaimer & Refund</h1>
                <p className="text-muted-foreground">Fair Usage and Revenue Protection Policy</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-12">
              <section className="bg-white/5 p-6 rounded-xl border border-white/5">
                <p className="text-lg leading-relaxed text-slate-300 m-0 italic">
                  Transparency is core to PickSpy. We aim to be fair to our users while protecting our operational costs and technical infrastructure.
                </p>
              </section>

              {/* Disclaimer Section */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-signal-caution" />
                  <h2 className="text-2xl font-semibold text-white m-0">Platform Disclaimer</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    PickSpy is an AI-driven market intelligence tool. We provide data-driven insights sourced from third-party platforms. By using PickSpy, you acknowledge that:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-signal-caution mt-2 shrink-0" />
                      <span>We are not responsible for any <strong className="text-white">financial losses</strong> or unsuccessful business ventures resulting from the use of our research.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-signal-caution mt-2 shrink-0" />
                      <span>Data accuracy (prices, ratings, etc.) is subject to the source platforms' update frequency.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-signal-caution mt-2 shrink-0" />
                      <span>The "AI Recommendation" is a tool for thought, not a guarantee of e-commerce success.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Refund Policy Section */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCcw className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">7-Day Refund Policy</h2>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl mb-6">
                  <p className="text-white font-bold mb-2">Our Stance: 7-Day Money-Back Guarantee</p>
                  <p className="text-sm text-slate-400">
                    We offer a full refund if requested within <strong className="text-white">7 days</strong> of your initial subscription payment. No questions asked for your first request.
                  </p>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">Anti-Fraud & Fair Use</h3>
                <p className="text-slate-300 mb-6 font-medium">
                  To protect our service from "serial refunders" and "friendly fraud," the following conditions apply:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Usage Limit", desc: "Refunds are ineligible if more than 10 AI analyses have been triggered." },
                    { title: "One-Time Offer", desc: "Refunds are only available once per customer. Subsequent signups are final." },
                    { title: "No Credits", desc: "We do not offer partial refunds or account credits for unused portions of a month." },
                    { title: "Chargebacks", desc: "Initiating a bank chargeback will result in permanent platform ban." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-white/5 border border-white/5 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">How to request a refund</h2>
                <p className="text-slate-300">
                  Simply email our billing department with your account email and transaction ID. We process all valid requests within 48 business hours.
                  <br />
                  <a href="mailto:billing@entrext.in" className="text-primary hover:underline font-bold mt-2 inline-block">billing@entrext.in</a>
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
