import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { blogs } from '@/data/blogs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  Share2, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Target,
  BarChart2
} from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find(b => b.slug === slug);

  // SEO and Meta Management
  React.useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | PickSpy Intelligence`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', blog.excerpt);
      }
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20">
        <article className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs & Back */}
          <div className="mb-8 flex items-center justify-between">
            <Link 
              to="/blog" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Intelligence Center
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Post Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className="text-primary border-primary/30 uppercase tracking-widest text-[10px]">
                {blog.category}
              </Badge>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {blog.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.15] tracking-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-4 p-4 glass-card-elevated border-l-4 border-l-primary w-fit">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                PS
              </div>
              <div>
                <div className="text-sm font-bold">{blog.author}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                   <Calendar className="h-3 w-3" /> {blog.date} 
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-16 glass-card shadow-glow">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-16">
            {/* Content Body */}
            <div className="prose prose-invert prose-primary max-w-none">
              <div className="space-y-8">
                {/* Introduction (Derived from Excerpt) */}
                <p className="text-xl text-muted-foreground leading-relaxed font-medium border-l-2 border-primary/30 pl-6 italic">
                  {blog.excerpt}
                </p>

                {/* Main Outline Sections */}
                {blog.outline.map((section, index) => (
                  <React.Fragment key={index}>
                    <section className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <span className="text-primary/40 text-sm font-mono hover:text-primary transition-colors">0{index + 1}</span>
                        {section}
                      </h2>
                      <div className="text-muted-foreground leading-relaxed space-y-4">
                        <p>
                          In the fast-paced world of e-commerce, staying ahead means leveraging every available data point. 
                          When we talk about <strong>{section.toLowerCase()}</strong>, we're looking at patterns that 
                          amateur sellers often overlook.
                        </p>
                        <p>
                          Professional dropshippers understand that {section.toLowerCase()} isn't just a checkbox—it's a 
                          dynamic part of the product lifecycle. This is where <em>Pickspy Intelligence</em> provides 
                          the edge by scanning thousands of data points daily to pinpoint exact shifts in market sentiment 
                          and launch velocity.
                        </p>
                        <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50 my-6">
                          <h4 className="flex items-center gap-2 text-primary font-bold mb-3 uppercase tracking-wider text-xs">
                            <Target className="h-4 w-4" /> Pro Insight
                          </h4>
                          <p className="text-sm italic">
                            "The difference between a 4-figure and a 6-figure store is often the ability to detect 
                            {section.toLowerCase()} signals 48 hours before the masses."
                          </p>
                        </div>
                      </div>
                    </section>
                    
                    {/* Insert content image if available */}
                    {blog.contentImages && blog.contentImages[index] && (
                      <div className="my-12 rounded-2xl overflow-hidden glass-card h-[300px] md:h-[400px]">
                        <img 
                          src={blog.contentImages[index]} 
                          alt={`${blog.title} - ${section}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Conclusion / Tool Positioning */}
                <section className="bg-surface-glass border border-primary/20 rounded-3xl p-8 md:p-12 text-center mt-12 overflow-hidden relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <Badge variant="premium" className="mb-6">The Verdict</Badge>
                  <h3 className="text-3xl font-bold mb-4">Leverage Real Product Intelligence</h3>
                  <p className="text-muted-foreground mb-8">
                    Stop gambling on your product selection. Join the elite founders using Pickspy to detect 
                    winning products before they ever hit the ad libraries.
                  </p>
                  <Button 
                    variant="hero" 
                    size="lg" 
                    onClick={() => navigate('/signup')}
                    className="group"
                  >
                    Start Free Intelligence Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </section>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Sticky Sidebar Content */}
              <div className="sticky top-24 space-y-8">
                {/* CTA Card */}
                <div className="glass-card-elevated p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3">
                    <Zap className="h-6 w-6 text-primary animate-pulse-glow" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Stop Guessing.</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    See what's actually launching and winning in real-time.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Live product launch tracking</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Competitor removal velocity</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Ad-spend waste detection</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-primary text-black font-bold hover:bg-primary/90"
                    onClick={() => navigate('/signup')}
                  >
                    Analyze Now
                  </Button>
                </div>

                {/* Statistics Box */}
                <div className="glass-card p-6 border-l-2 border-primary/50">
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <BarChart2 className="h-3 w-3" /> Market Intelligence
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">2,340+</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Daily Launch Signals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-signal-bullish">84%</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Accuracy Rate</div>
                    </div>
                  </div>
                </div>

                {/* Share/Tags */}
                <div className="glass-card p-6">
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] bg-secondary/50">#{blog.primaryKeyword.replace(/ /g, '')}</Badge>
                    <Badge variant="secondary" className="text-[10px] bg-secondary/50">#Ecommerce</Badge>
                    <Badge variant="secondary" className="text-[10px] bg-secondary/50">#Intel</Badge>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
