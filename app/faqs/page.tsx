"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqData = [
  {
    question: "NeelNir theke kivabe order korbo?",
    answer: "Order kora khub-e shohoj! Apnar pochondo moto product-ti cart-e add korun, tarpor checkout page-e giye apnar thikana ebong mobile number diye 'Place Order' button-e click korun."
  },
  {
    question: "Delivery charge koto ebong koto somoy lage?",
    answer: "Dhaka city-r bhetore delivery charge 70 taka (1-3 din) ebong Dhaka-r baire 120-150 taka (3-7 din) somoy lage."
  },
  {
    question: "Ami ki Cash on Delivery (COD) pabo?",
    answer: "Ji, amra shara Bangladesh-e Cash on Delivery service diye thaki. Tobe Dhaka-r baire order-er khetre delivery charge-ti advance pay korte hote pare."
  },
  {
    question: "Product kono karone kharap thakle ki korbo?",
    answer: "Jodi apnar product-ti damaged hoye thake, tobe oboshoy unboxing video-shoho amader contact korun. Amra 7 diner bhetore return ba exchange process shuru korbo."
  },
  {
    question: "Ami ki amar order track korte parbo?",
    answer: "Ji, order confirm houar por apni ekti Order ID paben. Amader website-er 'Track Order' page-e giye apni apnar order-er status real-time-e dekhte parben."
  },
  {
    question: "Apnader handmade product gulo ki durable?",
    answer: "NeelNir-er protiti product khub-e jotno ebong quality material diye toiri kora hoy. Jotno shoho nile egulo bohu din valo thake."
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-main px-4 max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Apnar mone thaka proshno gulo ekhane khujun. Aro kichu janar thakle amader message din.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-border/60 rounded-2xl overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "bg-card shadow-md ring-1 ring-primary/20" : "bg-card/50"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-base sm:text-lg ${activeIndex === index ? "text-primary" : "text-foreground"}`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 ml-4 p-1 rounded-full transition-transform duration-300 ${activeIndex === index ? "bg-primary text-white rotate-0" : "bg-muted text-muted-foreground"}`}>
                  {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 sm:p-6 pt-0 text-muted-foreground leading-relaxed text-sm sm:text-base border-t border-border/10">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Aro kichu janar ache?</h3>
          <p className="text-muted-foreground mb-6">
            Jodi ekhane apnar proshno-ti khuje na pan, tobe shorasori amader message korte paren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="gap-2 px-8 h-12 rounded-full font-bold">
                <MessageCircle className="w-4 h-4" /> Contact Us
              </Button>
            </Link>
            <a href="tel:01772162533">
              <Button variant="outline" className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/5 text-primary">
                Call Support
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}