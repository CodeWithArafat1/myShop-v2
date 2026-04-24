import { RefreshCcw, ShieldCheck, AlertCircle, Banknote, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Return & Refund Policy | NeelNir",
  description: "Learn about the return and refund process of NeelNir.",
};

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-20 ">
      {/* Header Section */}
      <div className="container-main px-4 max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-foreground mb-4">
          Return & <span className="text-primary">Refund</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Not satisfied with your purchase? Don't worry, we are here to help you with our easy return process.
        </p>
      </div>

      {/* Content Section */}
      <div className="container-main px-4 max-w-4xl mx-auto">
        <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-12">
          
          {/* 1. Return Period */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <RefreshCcw className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">1. Return Window</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                You have <strong className="text-foreground">7 days</strong> after receiving your item to request a return. After 7 days, we unfortunately cannot offer you a refund or exchange.
              </p>
            </div>
          </section>

          {/* 2. Eligibility Criteria */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">2. Eligibility for Returns</h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">To be eligible for a return, your item must meet the following conditions:</p>
              <ul className="space-y-3">
                {[
                  "The item must be in the same condition that you received it.",
                  "Unworn, unused, and with all original tags attached.",
                  "It must be in the original packaging.",
                  "A clear unboxing video is mandatory to claim returns for damaged or wrong products."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Non-Returnable Items */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">3. Non-Returnable Items</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Certain types of items cannot be returned, such as perishable goods (food, flowers, or plants), custom products (special orders or personalized items), and personal care goods (beauty products). We also do not accept returns for sale items or gift cards.
              </p>
            </div>
          </section>

          {/* 4. The Process */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">4. How to Initiate a Return</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                To start a return, you can contact us at <span className="font-bold text-foreground">support@neelnir.com</span>. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. 
              </p>
            </div>
          </section>

          {/* 5. Refunds */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Banknote className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">5. Refunds & Processing</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Once we receive and inspect your return, we will notify you if the refund was approved. If approved, you’ll be automatically refunded on your original payment method (bKash/Nagad/Bank) within <strong className="text-foreground">5-7 business days</strong>.
              </p>
            </div>
          </section>

        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link href="/contact">
            <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-all">
              Contact Support for Return
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}