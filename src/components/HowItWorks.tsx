export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Discover Trends",
      description: "Our AI scans social media and search engines to identify emerging consumer demands before they hit the mass market."
    },
    {
      number: "02",
      title: "Validate Products",
      description: "Cross-reference trends with live data from Amazon and Flipkart to verify demand, competition, and profit margins."
    },
    {
      number: "03",
      title: "Source & Launch",
      description: "Connect with verified suppliers and use our launch checklist to bring your winning product to market confidently."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-card/30 relative border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 px-2">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            From idea to empire in 3 steps
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            A simple, proven workflow to take you from analyzing data to generating revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 group">
              <div className="bg-background border border-primary/20 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary mx-auto mb-8 shadow-lg shadow-primary/10 transition-all group-hover:scale-110 group-hover:border-primary/50">
                {step.number}
              </div>
              <div className="text-center px-4">
                <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
