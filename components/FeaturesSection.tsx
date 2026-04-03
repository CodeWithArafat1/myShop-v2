"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import { Truck, RefreshCcw, Award, Banknote } from "lucide-react";
import { FeatureCard } from "./shared/cards/FeatureCard";

// --- Feature Data ---
const featuresData = [
  {
    title: "Free Delivery",
    description: "Free shipping on all orders above ৳1,500",
    icon: Truck,
  },
  {
    title: "Easy Return",
    description: "7-day hassle-free return policy",
    icon: RefreshCcw,
  },
  {
    title: "Premium Quality",
    description: "Handpicked finest quality fabrics",
    icon: Award,
  },
  {
    title: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
  },
];

// --- Custom Scroll Reveal Wrapper ---
// ✅ Add props type
type RevealProps = {
  children: ReactNode;
  delay?: number; // optional
};

function RevealOnScroll({ children, delay = 0 }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
       
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect(); // clean up
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
}

// --- Features Section ---
export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* CSS Grid for Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuresData.map((feature, index) => (
            <RevealOnScroll key={index} delay={index * 150}>
              <FeatureCard 
                title={feature.title} 
                description={feature.description} 
                icon={feature.icon} 
              />
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}