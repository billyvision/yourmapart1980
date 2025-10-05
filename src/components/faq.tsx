'use client'

import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What is YourMapArt?",
      answer: "YourMapArt creates personalized map art and star map designs. Transform your favorite locations and special dates into beautiful wall art that can be downloaded digitally or printed on high-quality posters and canvas."
    },
    {
      question: "What types of designs can I create?",
      answer: "We offer two unique design types: Map Posters (personalized city and location maps) and Star Maps (custom night sky designs showing constellations on special dates). Each design type offers multiple customization options and artistic styles."
    },
    {
      question: "How do I customize my design?",
      answer: "For Map Posters, simply enter your city or location and choose from 35+ artistic color themes and styles. For Star Maps, enter a special date and location to see the exact constellation arrangement for that moment. All designs include customizable text and color options."
    },
    {
      question: "What file formats do you provide?",
      answer: "We provide high-resolution PNG and PDF files at 300 DPI, perfect for professional printing at any size. All digital downloads are optimized for both home and commercial printing with crisp, clear details."
    },
    {
      question: "Can I order physical prints?",
      answer: "Yes! We offer premium printing on fine art paper, canvas, and poster materials with worldwide shipping. Choose from various sizes and finishes to match your space perfectly. All design types are available as physical prints."
    },
    {
      question: "How long does it take to create?",
      answer: "Most customers complete their design in under 5 minutes. The live preview shows your design in real-time as you customize it, making it easy to see exactly how your final map or star chart will look."
    },
    {
      question: "What are the shipping costs?",
      answer: "Shipping costs vary by location and product size. Standard shipping starts at $4.99 for posters and $9.99 for canvas prints within the US. International shipping rates are calculated at checkout."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day satisfaction guarantee on all physical prints. If you're not completely happy with your order, we'll provide a full refund or replacement. Digital downloads are final due to their instant nature."
    }
  ];

  // Split FAQs into two columns
  const mid = Math.ceil(faqs.length / 2);
  const faqsCol1 = faqs.slice(0, mid);
  const faqsCol2 = faqs.slice(mid);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent opacity-40"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-black mb-2">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about creating your personalized word art</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqsCol1.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-1-${index}`}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-md data-[state=open]:bg-gradient-to-br data-[state=open]:from-gray-900 data-[state=open]:to-black data-[state=open]:border-gray-800 transition-all duration-500 shadow-sm hover:shadow-lg hover:scale-[1.02] data-[state=open]:scale-[1.03] data-[state=open]:shadow-xl"
                >
                  <AccordionTrigger className="flex justify-between items-center w-full text-left px-5 py-4 hover:no-underline group [&>svg]:hidden">
                    <h3 className="text-base font-semibold text-black pr-4 group-data-[state=open]:text-white transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 group-hover:bg-gray-900 group-hover:text-white group-data-[state=open]:bg-white/90 group-data-[state=open]:text-black transition-all duration-300 group-hover:scale-110">
                      <ChevronDown className="h-4 w-4 text-gray-700 group-hover:text-white group-data-[state=open]:text-black transition-all duration-300 flex-shrink-0 group-data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-white">
                    <div className="pt-3 border-t border-gray-700/50 animate-in fade-in-50 slide-in-from-top-2 duration-500">
                      <p className="text-white/95 leading-relaxed">{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {/* Column 2 */}
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqsCol2.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-2-${index}`}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-md data-[state=open]:bg-gradient-to-br data-[state=open]:from-gray-900 data-[state=open]:to-black data-[state=open]:border-gray-800 transition-all duration-500 shadow-sm hover:shadow-lg hover:scale-[1.02] data-[state=open]:scale-[1.03] data-[state=open]:shadow-xl"
                >
                  <AccordionTrigger className="flex justify-between items-center w-full text-left px-5 py-4 hover:no-underline group [&>svg]:hidden">
                    <h3 className="text-base font-semibold text-black pr-4 group-data-[state=open]:text-white transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 group-hover:bg-gray-900 group-hover:text-white group-data-[state=open]:bg-white/90 group-data-[state=open]:text-black transition-all duration-300 group-hover:scale-110">
                      <ChevronDown className="h-4 w-4 text-gray-700 group-hover:text-white group-data-[state=open]:text-black transition-all duration-300 flex-shrink-0 group-data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-white">
                    <div className="pt-3 border-t border-gray-700/50 animate-in fade-in-50 slide-in-from-top-2 duration-500">
                      <p className="text-white/95 leading-relaxed">{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
