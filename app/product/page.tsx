import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import ShopContent from "@/components/ShopContent";

const API_URL = "https://my-shop-t2x7.vercel.app/api/products";

export default async function ShopPage() {
  let initialProducts = [];

  try {
    const res = await fetch(API_URL, { next: { revalidate: 3600 } });
    const data = await res.json();
    initialProducts = Array.isArray(data) ? data : data?.data || data?.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent initialProducts={initialProducts} />
    </Suspense>
  );
}

function ShopFallback() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        <div className="w-64 hidden md:block shrink-0 space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
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
  );
}