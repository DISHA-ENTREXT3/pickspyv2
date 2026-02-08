import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Cookie, Info, Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CookiePolicy() {
  const navigate = useNavigate();

  const cookieCategories = [
    {
      title: "Essential / Strictly Necessary",
      desc: "These cookies are required for PickSpy to function. They handle authentication, security, and session management. Without these, you wouldn't be able to log in or use the dashboard.",
      icon: ShieldCheck,
      examples: ["Auth Token", "CSRF Protection", "Session ID"]
    },
    {
      title: "Performance & Analytics",
      desc: "We use these to understand how users interact with our platform. This data helps us optimize the AI scraping speed and UI performance based on real-world usage patterns.",
      icon: Settings,
      examples: ["Google Analytics", "Usage Metrics", "Error Logging"]
    },
    {
      title: "Functional",
      desc: "These cookies remember your preferences, such as your region selection in the AI Analyzer or the last product you've compared, to provide a more personalized experience.",
      icon: CheckCircle2,
      examples: ["Region Settings", "Theme Preference", "Last Search"]
    },
    {
      title: "Targeting & Advertising",
      desc: "While we prioritize your privacy, we may use these to show you relevant information about our Pro upgrades on social media or other platforms based on your interest in certain features.",
      icon: Info,
      examples: ["Ad Remarketing", "Conversion Tracking"]
    }
  ];

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
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
                <p className="text-muted-foreground">Compliance with EU ePrivacy Directive (Cookie Law)</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-12">
              <section className="bg-white/5 p-6 rounded-xl border border-white/5">
                <p className="text-lg leading-relaxed text-slate-300 m-0 italic">
                  At PickSpy, we use "cookies" and similar tracking technologies to enhance your product research experience. This policy explains what they are, how we use them, and how you can control them.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-6">Categorization of Cookies</h2>
                <div className="grid gap-6">
                  {cookieCategories.map((cat, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <cat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{cat.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {cat.examples.map((ex, j) => (
                            <span key={j} className="text-[10px] uppercase tracking-wider font-bold bg-white/10 text-slate-300 px-2 py-1 rounded shadow-sm">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Preferences</h2>
                <p className="text-slate-300 mb-6">
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Banner or through your browser settings.
                </p>
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-4">
                  <p className="text-sm text-slate-400 m-0">
                    <strong className="text-white">On-Site:</strong> You can use our "Opt-Out" mechanism available at the bottom of the page to revoke consent for performance and targeting cookies at any time.
                  </p>
                  <p className="text-sm text-slate-400 m-0">
                    <strong className="text-white">Browser Level:</strong> Most browsers allow you to block cookies via the "Privacy/Security" settings. Note that blocking essential cookies may break core PickSpy functionality.
                  </p>
                </div>
              </section>

              <section className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">More Information</h2>
                <p className="text-slate-300">
                  We update this policy periodically to reflect changes in the cookies we use or for legal and regulatory reasons. For more information, please contact our transparency team at:
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
