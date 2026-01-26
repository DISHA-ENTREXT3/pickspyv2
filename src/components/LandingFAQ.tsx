import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Sparkles } from 'lucide-react';

export const LandingFAQ = () => {
  const faqs = [
    {
      question: "What is PickSpy and how does it work?",
      answer: "PickSpy is an AI-powered market intelligence platform designed for e-commerce entrepreneurs. It works by scanning global marketplaces like Amazon, eBay, and Flipkart, combined with social sentiment analysis from Reddit, TikTok, and Instagram. Our proprietary AI engine identifies high-velocity products with low market saturation, helping you find winning products before the competition."
    },
    {
      question: "Who should use PickSpy for product research?",
      answer: "PickSpy is built for dropshippers, e-commerce brand owners, digital marketers, and product researchers. Whether you are a solo entrepreneur starting your first Shopify store or a mature team looking to scale your product line, PickSpy provides the data-backed conviction needed to launch products successfully."
    },
    {
      question: "How does PickSpy identify 'Winning Products'?",
      answer: "A 'winning product' on PickSpy is identified through a combination of three factors: high trend velocity (growing search/social volume), low market saturation (limited existing competition), and positive consumer sentiment. Our AI Opportunity Score aggregates over 50 data points to give you a clear viability rating."
    },
    {
      question: "Which platforms does the PickSpy engine scan?",
      answer: "Our engine performs real-time scans across Amazon, Walmart, eBay, and Flipkart for sales data, as well as Pinterest, Reddit, TikTok, and Instagram Reels for social proof and emerging viral trends. This multi-engine approach ensures you get a 360-degree view of the market."
    },
    {
      question: "How is PickSpy different from other product research tools?",
      answer: "Unlike traditional tools that only look at historical sales data, PickSpy focuses on 'Conviction Engines.' We combine raw sales metrics with unfiltered social sentiment and AI-driven saturation tracking. This help you find products that are about to trend, rather than products that have already peaked."
    },
    {
      question: "Is PickSpy free to use?",
      answer: "PickSpy offers a freemium model. You can explore trending products and basic analytics for free. Advanced features like the deep AI Analyzer, competitor tracking, and real-time social signals are available under our Pro subscription plans."
    },
    {
      question: "Can I use PickSpy for India-specific or US-specific markets?",
      answer: "Yes, PickSpy is a global intelligence tool. We provide specific data for the Indian market via Flipkart and Amazon.in, while also offering deep coverage for the US, EU, and other global regions through Amazon.com, eBay, and international social signals."
    },
    {
      question: "How frequently is the data updated?",
      answer: "PickSpy uses live scrapers and real-time APIs. While our primary trend database is updated every 24 hours, the AI Analyzer and Live Price Comparison features perform real-time scans every time you request a deep-dive analysis."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3 text-foreground">
              <HelpCircle className="h-8 w-8 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Everything you need to know about PickSpy and AI-powered product research.
            </p>
          </div>

          <Card variant="glass" className="border-border/50 bg-card/50 shadow-xl shadow-primary/5">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/50 px-6 md:px-10">
                    <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-6 text-left text-lg font-bold text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base font-medium">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 text-center p-8 rounded-3xl bg-secondary/20 border border-primary/20 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-bold text-primary uppercase tracking-widest text-xs">Intelligence Support</span>
            </div>
            <p className="text-sm text-muted-foreground font-bold mb-4">
              Join our community of 2,800+ entrepreneurs on Discord or subscribe to our newsletter for daily trend drops.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
