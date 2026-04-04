"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductCard } from "@/components/shared/cards/ProductCard";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

const API_URL = "https://my-shop-t2x7.vercel.app/api/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [availableCategories, setAvailableCategories] = useState<string[]>([]); 
  const [availableColors, setAvailableColors] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({ 
    categories: [] as string[], 
    priceRange: [0, 50000], 
    colors: [] as string[],
    search: "" 
  });
  
  const [sortOption, setSortOption] = useState("newest");
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(12); 
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const cachedData = sessionStorage.getItem("shop_products_cache");
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            setAllProducts(parsedData);
            processFilters(parsedData); 
            setIsLoading(false);
            return; 
        }

        const res = await fetch(API_URL);
        const data = await res.json();
        
        const productsArray = Array.isArray(data) ? data : data.data || data.products || [];
        
        setAllProducts(productsArray);
        processFilters(productsArray);
        sessionStorage.setItem("shop_products_cache", JSON.stringify(productsArray));
        
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const processFilters = (products: any[]) => {
    const categories = [...new Set(products.map(product => product.category))].filter(Boolean) as string[];
    setAvailableCategories(categories.sort()); 

    const allColors = products.flatMap(product => product.colors || []);
    const uniqueColors = [...new Set(allColors.map(c => c.trim()))].filter(Boolean);
    setAvailableColors(uniqueColors.sort());
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const categoryParam = searchParams.get("category");

    setFilters(prev => ({
      ...prev,
      search: searchQuery || "", 
      categories: categoryParam ? [decodeURIComponent(categoryParam)] : prev.categories
    }));
  }, [searchParams]);

  const processedProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(searchTerm);
        const matchDesc = product.description?.toLowerCase().includes(searchTerm);
        const matchCat = product.category?.toLowerCase().includes(searchTerm);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
      
      if (filters.colors.length > 0) {
         const hasMatchingColor = product.colors?.some((pc: string) => 
           filters.colors.some(fc => fc.toLowerCase() === pc.toLowerCase())
         );
         if (!hasMatchingColor) return false;
      }

      const productPrice = product.price || 0;
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) return false;
      
      return true;
    });

    if (sortOption === "low") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "high") result.sort((a, b) => b.price - a.price);
    else result.reverse(); 

    return result;
  }, [filters, sortOption, allProducts]);

  useEffect(() => {
    setVisibleCount(12);
    setDisplayedProducts(processedProducts.slice(0, 12));
  }, [processedProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < processedProducts.length) {
            setIsFetchingMore(true);
            setTimeout(() => {
              setVisibleCount((prev) => prev + 8); 
              setIsFetchingMore(false);
            }, 600); 
        }
    }, { threshold: 0.1, rootMargin: '100px' });
    
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [visibleCount, processedProducts.length]);

  useEffect(() => {
    setDisplayedProducts(processedProducts.slice(0, visibleCount));
  }, [visibleCount, processedProducts]);

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: "" }));
    router.push("/shop"); 
  };

  const removeCategoryFilter = (cat: string) => {
     setFilters(prev => ({
       ...prev,
       categories: prev.categories.filter(c => c !== cat)
     }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 sticky top-0 md:static z-30 bg-background/95 backdrop-blur py-4 border-b md:border-none transition-all">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Shop Collection</h1>
          
          <div className="flex flex-wrap gap-2 min-h-[24px]">
            {filters.search && (
               <Badge variant="secondary" className="px-2 py-0.5 gap-1 cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" onClick={clearSearch}>
                 Search: "{filters.search}" <X size={12} />
               </Badge>
            )}
            {filters.categories.map(cat => (
               <Badge key={cat} variant="outline" className="px-2 py-0.5 gap-1 cursor-pointer hover:bg-muted" onClick={() => removeCategoryFilter(cat)}>
                 {cat} <X size={12} />
               </Badge>
            ))}
            {!isLoading && (
              <span className="text-xs text-muted-foreground flex items-center ml-1">
                {processedProducts.length} items found
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex-1 gap-2 border-dashed">
                <SlidersHorizontal size={16} /> Filters
                {(filters.categories.length > 0 || filters.colors.length > 0) && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1">
                    {filters.categories.length + filters.colors.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[380px] p-0 flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b shrink-0 bg-muted/30">
                <SheetTitle className="flex items-center gap-2"><Filter size={18} /> Filters</SheetTitle>
              </SheetHeader>
              
              {/* 🔥 Mobile Drawer Fix: ScrollArea Removed, Native Overflow Added */}
              <div className="flex-1 px-6 py-6 overflow-y-auto overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                <ShopSidebar 
                  filters={filters} 
                  setFilters={setFilters} 
                  availableCategories={availableCategories} 
                  availableColors={availableColors}
                />
              </div>

              <div className="p-4 border-t bg-background sticky bottom-0">
                <Button className="w-full" onClick={() => document.body.click()}>View Results</Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="w-[180px]">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        
        {/* SIDEBAR (Desktop) */}
        {/* 🔥 Desktop Scroll Fix: Native Overflow Added */}
        <aside className="w-64 hidden md:block shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <ShopSidebar 
              filters={filters} 
              setFilters={setFilters} 
              availableCategories={availableCategories} 
              availableColors={availableColors}
            />
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1 w-full min-h-[60vh]">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl bg-muted/50" />
                  <div className="space-y-2 p-1">
                    <Skeleton className="h-3 w-1/3 bg-muted/50" />
                    <Skeleton className="h-4 w-full bg-muted/50" />
                    <div className="flex justify-between pt-1">
                      <Skeleton className="h-4 w-1/4 bg-muted/50" />
                      <Skeleton className="h-4 w-1/4 bg-muted/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed rounded-xl bg-muted/10">
               <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <Search size={40} className="text-muted-foreground/50" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight">No products found</h3>
               <p className="text-muted-foreground mt-2 max-w-sm mb-6">
                 We couldn't find any items matching your filters.
               </p>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setFilters({ categories: [], priceRange: [0, 50000], colors: [], search: "" });
                   router.push("/product");
                 }} 
               >
                 Clear all filters
               </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayedProducts.map((product) => (
                  <ProductCard key={product._id} product={{ ...product, id: product._id }} />
              ))}
              
              {isFetchingMore && Array.from({ length: 4 }).map((_, i) => (
                 <div key={`more-${i}`} className="flex flex-col space-y-3">
                    <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                    <div className="space-y-2 p-1">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between pt-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                 </div>
              ))}
            </div>
          )}
          
          <div ref={observerTarget} className="h-20 w-full mt-8 flex items-center justify-center opacity-0 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
       <div className="container mx-auto px-4 py-8 max-w-[1600px]">
         <div className="flex flex-col md:flex-row gap-8 items-start relative">
             <div className="w-64 hidden md:block shrink-0 space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[100px] w-full" />
             </div>
             <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
               {Array.from({ length: 8 }).map((_, i) => (
                   <div key={i} className="flex flex-col space-y-3">
                     <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                     <div className="space-y-2 p-1">
                       <Skeleton className="h-3 w-1/3" />
                       <Skeleton className="h-4 w-full" />
                     </div>
                   </div>
               ))}
             </div>
          </div>
       </div>
    }>
      <ShopContent />
    </Suspense>
  );
}