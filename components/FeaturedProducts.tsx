"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ProductCard } from "./shared/cards/ProductCard";

// --- Types ---
type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  colors: string[];
  sizes: string[];
  image: string;
  images: string[];
  isNew: boolean;
  isFeatured: boolean;
  description: string;
  createdAt: string;
};

export default function FeaturedProducts() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Autoplay Plugin Setup
  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  // Fetch API Data
  React.useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // ক্যাশ থেকে ডাটা চেক করা (যাতে ব্যাক করলে সাথে সাথে লোড হয়)
        const cachedData = sessionStorage.getItem("shop_products_cache");
        let productsData = [];

        if (cachedData) {
          productsData = JSON.parse(cachedData);
        } else {
          // ক্যাশে না থাকলে API থেকে আনবে
          const res = await fetch("https://my-shop-t2x7.vercel.app/api/products");
          const data = await res.json();
          productsData = Array.isArray(data) ? data : data?.data || data?.products || [];
          
          if (productsData.length > 0) {
            sessionStorage.setItem("shop_products_cache", JSON.stringify(productsData));
          }
        }

        // শুধু ফিচার্ড প্রোডাক্ট ফিল্টার করা
        if (isMounted) {
          const featured = productsData.filter((p: Product) => p.isFeatured === true);
          setProducts(featured);
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Skeleton Card Component ---
  const SkeletonCard = () => (
    <div className="flex flex-col space-y-4 w-full">
      <div className="aspect-[3/4] sm:aspect-[4/5] w-full bg-stone-200 dark:bg-stone-800 animate-pulse rounded-2xl" />
      <div className="space-y-2 px-1">
        <div className="h-3 w-20 bg-stone-200 dark:bg-stone-800 animate-pulse rounded" />
        <div className="h-5 w-full bg-stone-200 dark:bg-stone-800 animate-pulse rounded" />
        <div className="h-6 w-24 bg-stone-200 dark:bg-stone-800 animate-pulse rounded mt-4" />
      </div>
    </div>
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            নির্বাচিত প্রোডাক্টসমূহ
          </h2>
          <p className="text-gray-500 mt-2">
            আমাদের নতুন কালেকশন থেকে বাছাইকৃত শাড়িসমূহ
          </p>
        </div>

        <div className="relative group/carousel">
          
          {loading ? (
            // --- Loading Skeleton Carousel ---
            <Carousel opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <SkeletonCard />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : products.length === 0 ? (
            // --- Empty State ---
            <div className="text-center py-10 text-gray-500">
              কোনো ফিচার্ড প্রোডাক্ট পাওয়া যায়নি।
            </div>
          ) : (
            // --- Actual Products Carousel ---
            <>
              <Carousel
                setApi={setApi}
                plugins={[autoplay.current]}
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent className="-ml-4 pb-4">
                  {products.map((product) => (
                    <CarouselItem
                      key={product._id}
                      className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Navigation Arrows */}
              <button
                onClick={() => api?.scrollPrev()}
                className="absolute -left-5 top-[40%] -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full hidden md:flex items-center justify-center hover:bg-gray-50 hover:scale-110 hover:text-green-600 transition-all z-10 border border-gray-100 opacity-0 group-hover/carousel:opacity-100 duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => api?.scrollNext()}
                className="absolute -right-5 top-[40%] -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full hidden md:flex items-center justify-center hover:bg-gray-50 hover:scale-110 hover:text-green-600 transition-all z-10 border border-gray-100 opacity-0 group-hover/carousel:opacity-100 duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

        </div>
      </div>
    </section>
  );
}