"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

interface ShopContentProps {
  initialProducts: any[];
}

export default function ShopContent({ initialProducts }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const initialCategoryParam = searchParams.get("category");
  const initialSearchParam = searchParams.get("search");

  const initialCategories = initialCategoryParam
    ? initialCategoryParam.split(",")
    : [];

  const availableCategories = useMemo(() => {
    const categories = [
      ...new Set(initialProducts.map((p) => p.category)),
    ].filter(Boolean) as string[];
    return categories.sort();
  }, [initialProducts]);

  const [filters, setFilters] = useState({
    categories: initialCategories,
    priceRange: [0, 50000],
    colors: [] as string[],
    search: initialSearchParam || "",
  });

  const [sortOption, setSortOption] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentCategoryParam = searchParams.get("category");
    const currentSearchParam = searchParams.get("search");

    const urlCategories = currentCategoryParam
      ? currentCategoryParam.split(",")
      : [];
    const urlSearch = currentSearchParam || "";

    setFilters((prev) => {
      if (
        prev.categories.join(",") !== urlCategories.join(",") ||
        prev.search !== urlSearch
      ) {
        return {
          ...prev,
          categories: urlCategories,
          search: urlSearch,
        };
      }
      return prev;
    });
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (filters.categories.length > 0) {
      params.set("category", filters.categories.join(","));
    } else {
      params.delete("category");
    }

    if (filters.search) {
      params.set("search", filters.search);
    } else {
      params.delete("search");
    }

    const newQuery = params.toString();
    const currentQuery = window.location.search.replace("?", "");

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [filters.categories, filters.search, pathname, router]);

  const dynamicColors = useMemo(() => {
    let relevantProducts = initialProducts;

    if (filters.categories.length > 0) {
      relevantProducts = relevantProducts.filter((p) =>
        filters.categories.includes(p.category),
      );
    }

    const allColors = relevantProducts.flatMap(
      (product) => product.colors || [],
    );
    const uniqueColors = [...new Set(allColors.map((c) => c.trim()))].filter(
      Boolean,
    );

    return uniqueColors.sort();
  }, [initialProducts, filters.categories]);

  const processedProducts = useMemo(() => {
    let result = initialProducts.filter((product) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(searchTerm);
        const matchDesc = product.description
          ?.toLowerCase()
          .includes(searchTerm);
        const matchCat = product.category?.toLowerCase().includes(searchTerm);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      )
        return false;

      if (filters.colors.length > 0) {
        const hasMatchingColor = product.colors?.some((pc: string) =>
          filters.colors.some((fc) => fc.toLowerCase() === pc.toLowerCase()),
        );
        if (!hasMatchingColor) return false;
      }

      const productPrice = product.price || 0;
      if (
        productPrice < filters.priceRange[0] ||
        productPrice > filters.priceRange[1]
      )
        return false;

      return true;
    });

    if (sortOption === "low") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "high") result.sort((a, b) => b.price - a.price);
    else result.reverse();

    return result;
  }, [filters, sortOption, initialProducts]);

  useEffect(() => {
    setVisibleCount(12);
  }, [processedProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < processedProducts.length
        ) {
          setIsFetchingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 8);
            setIsFetchingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [visibleCount, processedProducts.length]);

  const displayedProducts = processedProducts.slice(0, visibleCount);

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  const removeCategoryFilter = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 sticky top-0 md:static z-30 bg-background/95 backdrop-blur py-4 border-b md:border-none transition-all">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Shop Collection
          </h1>

          <div className="flex flex-wrap gap-2 min-h-[24px]">
            {filters.search && (
              <Badge
                variant="secondary"
                className="px-2 py-0.5 gap-1 cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                onClick={clearSearch}
              >
                Search: "{filters.search}" <X size={12} />
              </Badge>
            )}
            {filters.categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="px-2 py-0.5 gap-1 cursor-pointer hover:bg-muted"
                onClick={() => removeCategoryFilter(cat)}
              >
                {cat} <X size={12} />
              </Badge>
            ))}
            <span className="text-xs text-muted-foreground flex items-center ml-1">
              {processedProducts.length} items found
            </span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between gap-20 md:gap-0 md:w-auto md:justify-end">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden flex-1 gap-2 border-dashed"
              >
                <SlidersHorizontal size={16} /> Filters
                {(filters.categories.length > 0 ||
                  filters.colors.length > 0) && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1">
                    {filters.categories.length + filters.colors.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85%] sm:w-[380px] p-0 flex flex-col h-full"
            >
              <SheetHeader className="px-6 py-4 border-b shrink-0 bg-muted/30">
                <SheetTitle className="flex items-center gap-2">
                  <Filter size={18} /> Filters
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 px-6 py-6 overflow-y-auto overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                <ShopSidebar
                  filters={filters}
                  setFilters={setFilters}
                  availableCategories={availableCategories}
                  availableColors={dynamicColors}
                />
              </div>

              <div className="p-4 border-t bg-background sticky bottom-0">
                {/* Update this button to close the sheet properly */}
                <Button
                  className="w-full"
                  onClick={() => setIsFilterSheetOpen(false)}
                >
                  View Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-[180px] shrink-0">
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
        <aside className="w-64 hidden md:block shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <ShopSidebar
            filters={filters}
            setFilters={setFilters}
            availableCategories={availableCategories}
            availableColors={dynamicColors}
          />
        </aside>

        <div className="flex-1 w-full min-h-[60vh]">
          {displayedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                No products found
              </h3>
              <p className="text-muted-foreground mt-2 max-w-sm mb-6">
                We couldn't find any items matching your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    categories: [],
                    priceRange: [0, 50000],
                    colors: [],
                    search: "",
                  });
                  router.replace(`${pathname}`, { scroll: false });
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={{ ...product, id: product._id }}
                  priority={index < 4} // 🔥 THIS IS THE KEY TO FIXING YOUR SCORE
                />
              ))}

              {isFetchingMore &&
                Array.from({ length: 4 }).map((_, i) => (
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

          <div
            ref={observerTarget}
            className="h-20 w-full mt-8 flex items-center justify-center opacity-0 pointer-events-none"
          ></div>
        </div>
      </div>
    </div>
  );
}
