import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { blogs } from '@/data/blogs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, TrendingUp, Search, ChevronLeft } from 'lucide-react';

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  // SEO and Meta Management
  React.useEffect(() => {
    document.title = "PickSpy Blog | E-commerce Intelligence & Market Trends";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stay ahead of the e-commerce curve with expert strategies, market depth analysis, and trending product reports from the PickSpy Intelligence team.');
    }
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="group gap-2 text-muted-foreground hover:text-primary transition-all bg-card/20 hover:bg-card/40 border border-white/5"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </div>
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Pickspy Intelligence Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Data-Driven <span className="text-gradient-primary">Insights</span> for E-commerce Founders
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Expert strategies, market analysis, and product research intelligence to help you scale your dropshipping business with precision.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search articles, trends, or keywords..."
                className="w-full bg-secondary/50 border border-border/50 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {!searchQuery && (
            <>
              {/* Featured Post */}
              <div 
                className="group relative glass-card-elevated overflow-hidden mb-16 cursor-pointer transform transition-all hover:scale-[1.01]"
                onClick={() => navigate(`/blog/${featuredBlog.slug}`)}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-full relative overflow-hidden">
                    <img 
                      src={featuredBlog.image} 
                      alt={featuredBlog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent md:hidden" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="premium">Featured</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {featuredBlog.readTime}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          PS
                        </div>
                        <span className="text-sm font-medium">{featuredBlog.author}</span>
                      </div>
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {featuredBlog.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="flex items-center gap-4 mb-10">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Latest Intelligence
                </h3>
                <div className="h-px flex-1 bg-border/50" />
              </div>
            </>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.filter(b => b.id !== featuredBlog.id || searchQuery).map((blog) => (
              <article 
                key={blog.id}
                className="glass-card group flex flex-col h-full overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-glow hover:-translate-y-1"
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-primary font-semibold uppercase tracking-wider">{blog.category}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                        PS
                      </div>
                      <span className="text-xs text-muted-foreground">{blog.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 p-0 text-primary hover:bg-transparent flex items-center gap-1 group/btn">
                      Read More <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20 glass-card">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try searching for different keywords or categories.</p>
              <Button 
                variant="outline" 
                className="mt-6 border-primary/30"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-24 p-12 glass-card-elevated relative overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] -ml-32 -mb-32" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Stay ahead of the competition.</h2>
                <p className="text-muted-foreground text-lg mb-0">
                  Join 2,500+ dropshippers receiving weekly intelligence reports on winning products and market shifts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-background border border-border/50 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button variant="hero" className="w-full sm:w-auto">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
