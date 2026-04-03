"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
// Import the separated card component (Adjust path based on your folder structure)
import { CollectionCard } from "@/components/shared/cards/CollectionCard";

// Define strict types for stability
interface CollectionItem {
  name: string;
  image: string;
  count: number;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGroupCollections = async () => {
      try {
        // 1. Check if data exists in Session Storage Cache
        const cachedData = sessionStorage.getItem("shop_products_cache");
        
        if (cachedData) {
            const products = JSON.parse(cachedData);
            processCollections(products);
            setLoading(false);
            return; // Stop execution, avoid hitting API
        }

        // 2. Fetch from Live API if cache is empty
        const res = await fetch("https://my-shop-t2x7.vercel.app/api/products");
        const data = await res.json();
        
        // Handle array whether it's wrapped in a 'data' object or direct
        const products = Array.isArray(data) ? data : data?.data || data?.products || [];
        
        processCollections(products);
        
        // 3. Save to Session Storage for future use
        if (products.length > 0) {
          sessionStorage.setItem("shop_products_cache", JSON.stringify(products));
        }
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to group products by category
    const processCollections = (products: any[]) => {
        const categoriesMap = products.reduce((acc: Record<string, CollectionItem>, product: any) => {
          const catName = product.category;
          if (!catName) return acc; // Skip if no category exists
          
          if (!acc[catName]) {
            acc[catName] = {
              name: catName,
              image: product.image || "", // Use first product image as collection cover
              count: 1,
            };
          } else {
            acc[catName].count += 1;
          }
          return acc;
        }, {});
        
        setCollections(Object.values(categoriesMap));
    };

    fetchAndGroupCollections();
  }, []);

  return (
    <main className="min-h-screen transition-colors duration-500">
      
      {/* --- Semantic Section for SEO --- */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24 max-w-7xl">
        
        {/* --- Optimized Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-12 relative z-10">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> Curated
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
              Collections
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-base max-w-lg font-medium">
              Explore our handpicked categories tailored for your unique style.
            </p>
          </div>
          
          {/* High Contrast Link for Accessibility */}
          <Link 
            href="/shop" 
            aria-label="View all products in shop"
            className="group flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white border-b-2 border-stone-300 dark:border-stone-700 pb-1 hover:border-green-600 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all"
          >
            All Products 
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* --- Optimized Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          
          {loading ? (
            // Lightweight Skeletons to reduce DOM size during load
            Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 animate-pulse" 
              />
            ))
          ) : collections.length > 0 ? (
            // Map over dynamically generated collections
            collections.map((collection, index) => (
              <CollectionCard 
                key={collection.name} 
                collection={collection} 
                index={index} 
              />
            ))
          ) : (
             <div className="col-span-full text-center py-12 text-stone-500">
               No collections found.
             </div>
          )}
          
        </div>
      </section>
    </main>
  );
}