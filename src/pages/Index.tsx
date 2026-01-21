import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { AIAnalyzer } from '@/components/AIAnalyzer';
import { Footer } from '@/components/Footer';
import { Product } from '@/types/product';

import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

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
        <Features />
        <HowItWorks />

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
