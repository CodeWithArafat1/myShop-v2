"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; 
import { CategoryCard } from "./shared/cards/CategoryCard";

// --- Demo Data ---
const DEMO_CATEGORIES = [
  { id: 1, title: "Silk Saree", count: "124 Products", image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Cotton Saree", count: "86 Products", image: "https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Jamdani", count: "54 Products", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "Wedding Collection", count: "32 Products", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Party Wear", count: "45 Products", image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "Designer Saree", count: "28 Products", image: "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?q=80&w=600&auto=format&fit=crop" },
];

export default function CategorySection() {
  // Shadcn Carousel এর API State
  const [api, setApi] = useState<any>();

  return (
    <section className="py-16 sm:py-24 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* --- Header Section --- */}
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0f172a] tracking-tight mb-3">
                Browse by Category
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Find your perfect match from our diverse range of traditional and contemporary saree styles.
              </p>
            </div>
            
            <Button variant="ghost" className="text-[#0f172a] hover:text-[#16a34a] hover:bg-transparent font-bold px-0 shrink-0 group self-start md:self-end text-base">
              View All Categories
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* --- Shadcn Carousel Section with Custom API --- */}
        <Carousel
          setApi={setApi} 
          opts={{
            align: "start",
            loop: false,
            breakpoints: {
              "(min-width: 768px)": { slidesToScroll: 2 },
              "(min-width: 1024px)": { slidesToScroll: 3 },
            },
          }}
          className="w-full relative group/carousel"
        >
          <CarouselContent className="-ml-4 sm:-ml-6 pb-6 pt-2">
            {DEMO_CATEGORIES.map((category) => (
              <CarouselItem 
                key={category.id} 
                className="pl-4 sm:pl-6 basis-[60%] sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <CategoryCard 
                  title={category.title}
                  count={category.count}
                  image={category.image}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom Desktop Navigation Arrows */}
          <div className="opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            {/* Left Arrow */}
            <button 
              onClick={() => api?.scrollPrev()} // Custom Scroll Logic
              className="hidden md:flex absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-gray-100 z-10 text-gray-700 hover:text-[#16a34a] hover:scale-110 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow */}
            <button 
              onClick={() => api?.scrollNext()} // Custom Scroll Logic
              className="hidden md:flex absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-gray-100 z-10 text-gray-700 hover:text-[#16a34a] hover:scale-110 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </Carousel>

      </div>
    </section>
  );
}