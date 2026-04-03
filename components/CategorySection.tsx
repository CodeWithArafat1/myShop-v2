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
import Link from "next/link"; // Link ইম্পোর্ট করা হলো পেজ রাউটিং এর জন্য

// --- Demo Data ---
const DEMO_CATEGORIES = [
  {
    id: 1,
    title: "সিল্ক শাড়ি",
    count: "১২৪টি প্রোডাক্ট",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "সুতি শাড়ি",
    count: "৮৬টি প্রোডাক্ট",
    image:
      "https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "জামদানি",
    count: "৫৪টি প্রোডাক্ট",
    image:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "বিয়ের কালেকশন",
    count: "৩২টি প্রোডাক্ট",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "পার্টি ওয়্যার",
    count: "৪৫টি প্রোডাক্ট",
    image:
      "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "ডিজাইনার শাড়ি",
    count: "২৮টি প্রোডাক্ট",
    image:
      "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?q=80&w=600&auto=format&fit=crop",
  },
];

export default function CategorySection() {
  const [api, setApi] = useState<any>();

  return (
    <section className="py-16 sm:py-24 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* --- Header Section --- */}
        <div className="mb-10 lg:mb-12">
          {/* Desktop Layout: Side by Side */}
          <div className="hidden sm:flex flex-row items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#0f172a] tracking-tight">
                ক্যাটাগরি অনুযায়ী খুঁজুন
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mt-2">
                আমাদের ঐতিহ্যবাহী এবং আধুনিক শাড়ির বিশাল কালেকশন থেকে আপনার
                পছন্দেরটি বেছে নিন।
              </p>
            </div>

            <Link href="/collections">
              <Button
                variant="ghost"
                className="text-[#0f172a] cursor-pointer hover:text-[#16a34a] hover:bg-transparent font-bold px-0 shrink-0 group text-base h-auto"
              >
                সব কালেকশন দেখুন
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Layout: Centered with a beautiful button */}
          <div className="flex flex-col items-center text-center sm:hidden gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                ক্যাটাগরি অনুযায়ী খুঁজুন
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mt-2 px-2">
                আমাদের ঐতিহ্যবাহী এবং আধুনিক শাড়ির বিশাল কালেকশন থেকে আপনার
                পছন্দেরটি বেছে নিন।
              </p>
            </div>
          </div>
        </div>

        {/* --- Shadcn Carousel Section --- */}
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
            <button
              onClick={() => api?.scrollPrev()}
              className="hidden md:flex absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-gray-100 z-10 text-gray-700 hover:text-[#16a34a] hover:scale-110 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => api?.scrollNext()}
              className="hidden md:flex absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-gray-100 z-10 text-gray-700 hover:text-[#16a34a] hover:scale-110 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </Carousel>
        <Link href="/collections" className="w-full mt-2 sm:hidden cursor-pointer">
          <Button variant={"link"} className="w-full cursor-pointer  rounded-full font-medium h-12 shadow-sm transition-all flex items-center justify-center gap-2">
            সব কালেকশন দেখুন
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
