"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface ShopSidebarProps {
  filters: {
    categories: string[];
    priceRange: number[];
    colors: string[];
    search: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  availableCategories: string[];
  availableColors: string[];
}

// 🔥 React.memo ব্যবহার করা হলো যাতে অপ্রয়োজনীয় রেন্ডার বন্ধ হয়ে পারফরম্যান্স বাড়ে
export const ShopSidebar = React.memo(function ShopSidebar({ 
  filters, 
  setFilters, 
  availableCategories, 
  availableColors 
}: ShopSidebarProps) {
  
  const [localPrice, setLocalPrice] = useState(filters.priceRange);

  useEffect(() => {
    setLocalPrice(filters.priceRange);
  }, [filters.priceRange]);

  const toggleCategory = (cat: string) => {
    setFilters((prev: any) => {
      const exists = prev.categories.includes(cat);
      return { ...prev, categories: exists ? prev.categories.filter((c: string) => c !== cat) : [...prev.categories, cat] };
    });
  };

  const toggleColor = (color: string) => {
    setFilters((prev: any) => {
      const exists = prev.colors.includes(color);
      return { ...prev, colors: exists ? prev.colors.filter((c: string) => c !== color) : [...prev.colors, color] };
    });
  };

  return (
    <div className="space-y-8 pb-20 pr-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button 
          variant="ghost" size="sm" 
          onClick={() => {
             setFilters({ categories: [], priceRange: [0, 50000], colors: [], search: "" });
             setLocalPrice([0, 50000]); 
          }}
          className="h-8 text-xs text-muted-foreground hover:text-red-500 px-2"
        >
          Reset All
        </Button>
      </div>
      <Separator />

      {/* Categories: 🔥 JS ScrollArea এর বদলে Native CSS Scrollbar ব্যবহার করা হলো */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Categories</h3>
        <div className="max-h-[250px] w-full pr-3 overflow-y-auto overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="space-y-3 pb-2">
            {availableCategories.length > 0 ? (
              availableCategories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={cat} 
                    checked={filters.categories.includes(cat)} 
                    onCheckedChange={() => toggleCategory(cat)} 
                  />
                  <label htmlFor={cat} className="text-sm font-medium cursor-pointer select-none leading-none capitalize">
                    {cat}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No categories found</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <div className="flex justify-between mb-4 items-center">
           <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Price</h3>
           <Badge variant="outline" className="font-mono text-xs">
             ৳{localPrice[0]} - ৳{localPrice[1]}
           </Badge>
        </div>
        <Slider 
          value={localPrice} 
          min={0} max={50000} step={500} 
          className="py-4" 
          onValueChange={(val) => setLocalPrice(val)} 
          onValueCommit={(val) => setFilters((prev: any) => ({ ...prev, priceRange: val }))} 
        />
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {availableColors.length > 0 ? (
            availableColors.map((c) => {
              const isActive = filters.colors.includes(c);
              const isWhite = c.toLowerCase() === 'white' || c.toLowerCase() === '#ffffff';
              
              return (
                <div 
                  key={c} 
                  onClick={() => toggleColor(c)}
                  className={`
                    h-8 w-8 rounded-full cursor-pointer shadow-sm flex items-center justify-center transition-all
                    ${isActive ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105 hover:shadow-md"}
                  `}
                  style={{ 
                    backgroundColor: c, 
                    border: '1px solid rgba(0,0,0,0.1)' 
                  }}
                  title={c}
                >
                  {isActive && <Check size={14} className={`${isWhite ? 'text-black' : 'text-white'} drop-shadow-md`} />}
                </div>
              )
            })
          ) : (
             <p className="text-xs text-muted-foreground">No colors found</p>
          )}
        </div>
      </div>
    </div>
  );
});