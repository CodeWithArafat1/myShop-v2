import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export interface Product {
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
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-300 relative flex flex-col h-full">
      
      {/* --- Image Section --- */}
      <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-50 cursor-pointer">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badges (Left & Right) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Left Badge (Dynamic based on isNew or isFeatured) */}
          {product.isNew ? (
            <span className="bg-[#16a34a] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
              New
            </span>
          ) : product.isFeatured ? (
            <span className="bg-blue-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
              Bestseller
            </span>
          ) : (
            <div /> // Empty div to keep flex space-between working
          )}

          {/* Right Badge (Discount %) */}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* --- Details Section --- */}
      <div className="p-5 flex flex-col grow justify-between gap-4">
        
        {/* Product Title */}
        <a href={`/product/${product._id}`} className="hover:text-[#16a34a] transition-colors">
          <h3 className="text-[#0f172a] font-bold text-lg line-clamp-1">
            {product.name}
          </h3>
        </a>

        {/* Price & Cart Button Row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-[#16a34a] font-bold text-lg">
              ৳{product.price.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-gray-400 text-sm font-medium line-through">
                ৳{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button 
            className="w-10 h-10 rounded-xl bg-[#e8f7ed] text-[#16a34a] flex items-center justify-center hover:bg-[#16a34a] hover:text-white transition-colors duration-300 shadow-sm"
            aria-label="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
              console.log("Added to cart:", product._id);
            }}
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
        
      </div>
    </div>
  );
}