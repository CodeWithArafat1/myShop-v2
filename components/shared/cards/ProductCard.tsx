import Image from "next/image";
import Link from "next/link";

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
      <Link href={`/product/${product._id}`} className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badges (Left & Right) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          {/* Left Badge (Dynamic based on isNew or isFeatured) */}
          {product.isNew ? (
            <span className="bg-[#16a34a] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm pointer-events-auto">
              New
            </span>
          ) : product.isFeatured ? (
            <span className="bg-blue-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm pointer-events-auto">
              Bestseller
            </span>
          ) : (
            <div /> // Empty div to keep flex space-between working
          )}

          {/* Right Badge (Discount %) */}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm pointer-events-auto">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </Link>

      {/* --- Details Section --- */}
      <div className="p-5 flex flex-col grow justify-between gap-4">
        
        {/* Product Title */}
        <Link href={`/product/${product._id}`} className="hover:text-[#16a34a] transition-colors">
          <h3 className="text-[#0f172a] font-bold text-lg line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-[#16a34a] font-bold text-lg">
            ৳{product.price.toLocaleString()}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-gray-400 text-sm font-medium line-through">
              ৳{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
        
      </div>
    </div>
  );
}