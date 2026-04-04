"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// --- Category Card Component ---
interface CategoryCardProps {
  title: string;
  count: string;
  image: string;
  href?: string;
}

export function CategoryCard({ title, count, image, href = "/product" }: CategoryCardProps) {
  return (
    <Link href={href} className="block w-full group">
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[20px] overflow-hidden shadow-sm hover:shadow-sm shadow-green-100/80 transition-shadow duration-300 border border-black/5 bg-gray-100">
        
        {/* Background Image */}
        <Image
          src={image || "/placeholder.png"}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content Wrapper */}
        <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-0.5 tracking-tight drop-shadow-md capitalize">
            {title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm font-medium drop-shadow-sm">
            {count}
          </p>
        </div>

      </div>
    </Link>
  );
}

// --- Category Skeleton Component ---
export function CategorySkeletonCard() {
  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[20px] overflow-hidden border border-black/5 bg-gray-200 animate-pulse">
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-gray-300 to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 space-y-2.5">
        <div className="h-5 sm:h-6 bg-gray-400/40 rounded-md w-3/4"></div>
        <div className="h-3 sm:h-4 bg-gray-400/40 rounded-md w-1/2"></div>
      </div>
    </div>
  );
}

// --- Main Category Section Component ---
interface CategoryItem {
  id: string;
  title: string;
  count: number;
  image: string;
}

export default function CategorySection() {
  const [api, setApi] = useState<any>();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to process categories
  const processCategories = (products: any[]) => {
    const categoriesMap = products.reduce((acc: Record<string, CategoryItem>, product: any) => {
      const catName = product.category;
      if (!catName) return acc;
      
      if (!acc[catName]) {
        acc[catName] = {
          id: catName,
          title: catName,
          count: 1,
          image: product.image || "", 
        };
      } else {
        acc[catName].count += 1;
      }
      return acc;
    }, {});

    setCategories(Object.values(categoriesMap));
  };

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks if unmounted quickly

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const cachedData = sessionStorage.getItem("shop_products_cache");
        let products = [];

        if (cachedData) {
          products = JSON.parse(cachedData);
          if (isMounted) {
            processCategories(products);
            setLoading(false);
          }
          return; // Exit early since we used cache
        } 

        // If no cache, fetch from API
        const res = await fetch("https://my-shop-t2x7.vercel.app/api/products");
        const data = await res.json();
        products = Array.isArray(data) ? data : data?.data || data?.products || [];
        
        if (products.length > 0) {
          sessionStorage.setItem("shop_products_cache", JSON.stringify(products));
        }

        if (isMounted) {
          processCategories(products);
        }
        
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false; // Cleanup function to fix the back button glitch
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* --- Header Section --- */}
        <div className="mb-10 lg:mb-12">
          {/* Desktop Layout */}
          <div className="hidden sm:flex flex-row items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#0f172a] tracking-tight">
                ক্যাটাগরি অনুযায়ী খুঁজুন
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mt-2">
                আমাদের ঐতিহ্যবাহী এবং আধুনিক কালেকশন থেকে আপনার
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

          {/* Mobile Layout */}
          <div className="flex flex-col items-center text-center sm:hidden gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                ক্যাটাগরি অনুযায়ী খুঁজুন
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mt-2 px-2">
                আমাদের ঐতিহ্যবাহী এবং আধুনিক কালেকশন থেকে আপনার
                পছন্দেরটি বেছে নিন।
              </p>
            </div>
          </div>
        </div>

        {/* --- Shadcn Carousel Section --- */}
        {loading ? (
          // --- Skeleton Loader Carousel ---
          <Carousel
            opts={{
              align: "start",
              loop: false,
              breakpoints: {
                "(min-width: 768px)": { slidesToScroll: 2 },
                "(min-width: 1024px)": { slidesToScroll: 3 },
              },
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 sm:-ml-6 pb-6 pt-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={`skeleton-${index}`}
                  className="pl-4 sm:pl-6 basis-[60%] sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <CategorySkeletonCard />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">
             কোনো ক্যাটাগরি পাওয়া যায়নি।
          </div>
        ) : (
          // --- Actual Content Carousel ---
          <>
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
                {categories.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="pl-4 sm:pl-6 basis-[60%] sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <CategoryCard
                      title={category.title}
                      count={`${category.count} Items`} // Updated to english for cleaner look
                      image={category.image}
                      href={`/product?category=${encodeURIComponent(category.title)}`}
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
              <Button variant={"link"} className="w-full cursor-pointer rounded-full font-medium h-12 shadow-sm transition-all flex items-center justify-center gap-2">
                সব কালেকশন দেখুন
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}