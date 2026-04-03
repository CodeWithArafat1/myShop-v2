"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Assuming you have this interface from earlier
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
}

// ----------------------------------------------------------------------
// MOCK DATA: Remove this when you connect your actual database fetch logic
// ----------------------------------------------------------------------
const mockProduct: Product = {
  _id: "69920c590f7a159eeeade0a1",
  name: "Exclusive Red Banarasi Silk Saree",
  category: "Gujarati Saree",
  price: 3140,
  oldPrice: 4200,
  colors: ["#ef4444", "#eab308", "#14b8a6"], // Hex codes or names
  sizes: ["Standard", "Free Size"],
  image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733958-d259728f309b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=800&auto=format&fit=crop"
  ],
  isNew: true,
  isFeatured: false,
  description: "Experience the timeless elegance with our Exclusive Red Banarasi Silk Saree. Woven with pure silk threads and intricate golden zari work, this saree is a masterpiece of traditional craftsmanship. Perfect for weddings, festivals, and grand occasions. The lightweight fabric ensures comfort while maintaining a majestic drape throughout the day. Comes with an unstitched blouse piece."
};

export default function ProductDetailsPage() {
  // In a real app, fetch the product using the [id] from params
  const product = mockProduct; 

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleQuantity = (type: "increase" | "decrease") => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (type === "increase" && quantity < 10) setQuantity(quantity + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-[1400px]">
      
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#16a34a] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/shop" className="hover:text-[#16a34a] transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* --- LEFT COLUMN: Image Gallery --- */}
        <div className="flex flex-col gap-4 sticky top-24 h-fit">
          {/* Main Large Image */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500"
              priority
            />
            {/* Badges overlay on main image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.isNew && (
                <span className="bg-[#16a34a] text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm w-fit pointer-events-auto">
                  New Arrival
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm w-fit pointer-events-auto">
                  -{discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? "border-[#16a34a] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: Product Details --- */}
        <div className="flex flex-col pt-2 lg:pt-6">
          
          <div className="mb-2">
             <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">{product.category}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-extrabold text-[#16a34a]">
              ৳{product.price.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xl text-gray-400 font-medium line-through mb-1">
                ৳{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Separator className="my-6" />

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Color <span className="text-gray-500 font-normal normal-case ml-2">- Selected</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => {
                  const isWhite = c.toLowerCase() === 'white' || c.toLowerCase() === '#ffffff';
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm
                        ${selectedColor === c ? "ring-2 ring-offset-4 ring-gray-900 scale-110" : "hover:scale-105 border border-gray-200"}
                      `}
                      style={{ backgroundColor: c }}
                      title={c}
                      aria-label={`Select color ${c}`}
                    >
                      {selectedColor === c && (
                        <Check size={20} className={`${isWhite ? 'text-black' : 'text-white'} drop-shadow-md`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Size</h3>
                 <button className="text-sm text-[#16a34a] hover:underline font-medium">Size Guide</button>
               </div>
               <div className="flex flex-wrap gap-3">
                 {product.sizes.map((size) => (
                   <button
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`
                       px-6 py-2.5 rounded-full text-sm font-medium transition-all border
                       ${selectedSize === size 
                         ? "bg-[#16a34a] border-[#16a34a] text-white shadow-md" 
                         : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"}
                     `}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-full sm:w-36 h-14 shrink-0">
              <button 
                onClick={() => handleQuantity("decrease")}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="font-semibold text-gray-900 text-lg w-8 text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantity("increase")}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={quantity >= 10}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button 
              className="flex-1 h-14 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              onClick={() => {
                console.log("Adding to cart:", { product, quantity, selectedColor, selectedSize });
                // Trigger your cart context or API here
              }}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </Button>

            {/* Wishlist Button */}
            <Button 
              variant="outline" 
              className="w-14 h-14 rounded-xl border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shrink-0 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={24} />
            </Button>

          </div>

          <Separator className="my-10" />

          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
            
            {/* Simulated Additional Info List */}
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                100% Original Product
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                Pay on delivery is available
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                Easy 7 days return and exchange available
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}