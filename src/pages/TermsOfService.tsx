import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Gavel, UserCheck, ShieldAlert, Ban, Scale, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsOfService() {
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
                <Gavel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Terms & Conditions</h1>
                <p className="text-muted-foreground">Standard Agreement for Global SaaS Operations</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-12">
              <section className="bg-white/5 p-6 rounded-xl border border-white/5">
                <p className="text-lg leading-relaxed text-slate-300 italic">
                  PickSpy is a powerful AI-driven product research tool designed for dropshippers, e-commerce agencies, and digital entrepreneurs. By using our platform, you agree to the following terms.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">1. User Account & Eligibility</h2>
                </div>
                <p className="text-slate-300">
                  To use PickSpy, you must be at least 18 years of age or the age of legal majority in your jurisdiction. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Any unauthorized use must be reported to our security team immediately.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">2. Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    <strong className="text-white">Our Rights:</strong> PickSpy, its logos, AI algorithms, scraping technology, and source code are the exclusive property of Entrext. You are granted a limited, non-exclusive license to use the interface and data results.
                  </p>
                  <p>
                    <strong className="text-white">Your Data:</strong> You retain all ownership rights to the data you upload or projects you create within the platform. However, you grant us a license to process this data to provide and improve the service.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Ban className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">3. Prohibited Activities</h2>
                </div>
                <p className="text-slate-300 mb-4">You agree not to engage in the following "Prohibited Uses":</p>
                <ul className="grid md:grid-cols-2 gap-4 list-none p-0 m-0">
                  {[
                    "Attempting to DDoS or breach platform security",
                    "Reselling raw data scrapes to third parties",
                    "Using PickSpy for illegal market manipulation",
                    "Reverse engineering our proprietary AI models"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg border border-white/5 text-sm text-slate-400">
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold text-white m-0">4. Limitation of Liability</h2>
                </div>
                <p className="text-slate-300 mb-4">
                  PickSpy provides market intelligence based on third-party sources (Amazon, Reddit, etc.). We do not guarantee the accuracy, completeness, or profitability of any product ideas discovered.
                </p>
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-200 m-0 uppercase font-bold tracking-wider">
                    Disclaimer: In no event shall PickSpy be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the service, including loss of profits or data.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Governing Law & Jurisdiction</h2>
                <p className="text-slate-300">
                  These Terms are primarily governed by the laws of India. However, as PickSpy is a global platform, users are also subject to their local laws where applicable. Any disputes shall be resolved through binding arbitration in Mumbai, India.
                </p>
              </section>

              <section className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Termination of Service</h2>
                <p className="text-slate-300">
                  We reserve the right to suspend or terminate your account at any time for violations of these terms, specifically those relating to platform abuse or non-payment. Upon termination, your right to use the service ceases immediately.
                </p>
                <a href="mailto:business@entrext.in" className="text-primary hover:underline font-bold mt-4 inline-block">business@entrext.in</a>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
