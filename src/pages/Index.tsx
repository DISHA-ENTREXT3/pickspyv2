import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { AIAnalyzer } from '@/components/AIAnalyzer';
import { Footer } from '@/components/Footer';
import { Product } from '@/types/product';

import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { LandingFAQ } from '@/components/LandingFAQ';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const location = useLocation();

  // SEO and Meta Management + Scroll Logic
  useEffect(() => {
    document.title = "PickSpy | AI Product Research Tool for Finding Winning Products 🚀";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stop guessing. PickSpy uses AI to scan Amazon, Reddit, and Social Trends to identify high-profit, low-competition products for your e-commerce store. Start winning today!');
    }

    // Scroll Logic
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const handleAnalyze = (product: Product) => {
    setSelectedProduct(product);
    setShowAnalyzer(true);
    // Scroll to analyzer
    setTimeout(() => {
      document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        {/* Marketing Sections */}
        <HowItWorks />
        <Features />

        <ProductGrid onAnalyze={handleAnalyze} />
        
        {/* AI Analyzer Section */}
        <section id="analyzer" className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <AIAnalyzer 
                selectedProduct={selectedProduct} 
                onClose={showAnalyzer ? () => setShowAnalyzer(false) : undefined}
              />
            </div>
          </div>
        </section>

        <Testimonials />
        
        {/* Platform FAQ (SEO/AEO Optimized) */}
        <LandingFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
