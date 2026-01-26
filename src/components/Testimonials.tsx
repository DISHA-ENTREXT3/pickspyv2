import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Alex M.",
    role: "Dropshipper",
    content: "PickSpy completely changed how I find products. I went from testing 10 products to find 1 winner, to finding 3 winners in a row.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Alex+M&background=random"
  },
  {
    name: "Sarah K.",
    role: "Amazon FBA Seller",
    content: "The competitor analysis is scary good. I can see exactly where my rivals are getting their traffic and undercut them perfectly.",
    rating: 4,
    image: "https://ui-avatars.com/api/?name=Sarah+K&background=random"
  },
  {
    name: "James L.",
    role: "E-commerce Brand Owner",
    content: "Finally, a tool that combines social trends with hard sales data. It's the only research tool I use now.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=James+L&background=random"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-16 px-2">
          Loved by 12,000+ Founders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg shadow-primary/5 transition-all hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-1 mb-6 text-yellow-500">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-lg text-foreground/90 mb-8 leading-relaxed italic font-medium">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border border-border/50" />
                <div>
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
