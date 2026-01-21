import { Zap, Search, BarChart2, Globe, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Deep Market Intelligence",
    description: "Scan millions of data points from Amazon, Flipkart, and Google Trends instantly to find winning products."
  },
  {
    icon: TrendingUp,
    title: "Real-Time Trend Spotting",
    description: "Catch viral trends before they peak with our advanced social signal detection algorithms."
  },
  {
    icon: BarChart2,
    title: "Competitor Analysis",
    description: "Spy on your competitors' pricing, stock levels, and review velocity to outmaneuver them."
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    description: "Compare prices across Alibaba, AliExpress, and 15+ other platforms to find the best margins."
  },
  {
    icon: Zap,
    title: "AI Opportunity Score",
    description: "Get a single metric that predicts a product's success probability based on 50+ factors."
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify potential trademark issues, saturation risks, and shipping bottlenecks early."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6">
            Everything you need to scale
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to help you find, validate, and launch winning products faster than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
