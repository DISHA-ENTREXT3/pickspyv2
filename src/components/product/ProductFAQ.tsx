import React from 'react';
import { FAQ } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { HelpCircle, Sparkles } from 'lucide-react';

interface ProductFAQProps {
  faqs: FAQ[];
  productName: string;
}

export const ProductFAQ = ({ faqs, productName }: ProductFAQProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-secondary/10">
        <CardTitle className="text-xl flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Product Intelligence FAQ
          <Sparkles className="h-4 w-4 text-amber-400 ml-auto animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/50 px-6">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
