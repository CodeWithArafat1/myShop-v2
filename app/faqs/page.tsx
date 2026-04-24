"use client";

import { useState } from "react";
import { Plus, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-main px-4 max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <HelpCircle className="w-4 h-4" /> Support Center
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div 
                key={index}
                initial={false}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? "bg-card border-primary/30 shadow-lg" : "bg-card/50 border-border/60"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full cursor-pointer flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className={`font-bold  text-base sm:text-lg transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "#16a34a" : "transparent" }}
                    className={`shrink-0 ml-4 p-1 rounded-full border ${isOpen ? "text-white border-transparent" : "text-muted-foreground border-border"}`}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="p-5 sm:p-6 pt-0 text-muted-foreground leading-relaxed text-sm sm:text-base border-t border-border/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-foreground mb-4">Aro kichu janar ache?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="gap-2 cursor-pointer px-8 h-12 rounded-full font-bold shadow-lg shadow-primary/20">
                <MessageCircle className="w-4 h-4" /> Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}