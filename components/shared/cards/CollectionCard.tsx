import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CollectionCardProps {
  collection: {
    name: string;
    image: string;
    count: number;
  };
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(collection.name)}`}
      className="group relative block w-full focus:outline-none focus:ring-4 focus:ring-green-500/50 rounded-3xl"
      aria-label={`Go to ${collection.name} collection having ${collection.count} items`}
    >
      {/* Image Container with CLS Protection */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-800/50 bg-stone-100 dark:bg-stone-900">
        
        {/* Performance Optimized Image */}
        <Image
          src={collection.image || "/placeholder.png"}
          alt={`${collection.name} collection cover image`}
          fill
          // Priority = True for first 4 images (LCP Improvement)
          priority={index < 4}
          // Sizes prop is CRUCIAL for Lighthouse Performance Score
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay for Text Contrast (Accessibility) */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" 
          aria-hidden="true" 
        />

        {/* Glassmorphism Content Bar */}
        <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4">
          <div className="overflow-hidden rounded-xl md:rounded-2xl bg-white/10 dark:bg-black/60 backdrop-blur-md border border-white/20 dark:border-white/10 p-3 md:p-4 shadow-lg transition-transform duration-500 group-hover:translate-y-[-4px]">
            
            <div className="flex justify-between items-center">
              <div className="min-w-0">
                <h2 className="text-sm md:text-lg font-bold text-white tracking-wide truncate pr-2">
                  {collection.name}
                </h2>
                <p className="text-[10px] md:text-xs font-bold text-stone-200 uppercase tracking-widest mt-0.5">
                  {collection.count} Items
                </p>
              </div>
              
              {/* Decorative Icon */}
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0">
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            
            {/* CSS-only Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />
          </div>
        </div>

      </div>
    </Link>
  );
}