"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext"; 

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  // --- EMPTY STATE ---
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="h-32 w-32 bg-[#16a34a]/5 rounded-full flex items-center justify-center mb-8 border-2 border-[#16a34a]/10 animate-in zoom-in-50">
          <ShoppingBag className="h-14 w-14 text-[#16a34a]/40" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 text-base max-w-sm mb-10 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Discover our latest collections!
        </p>
        <Link href="/product">
          <Button size="lg" className="h-14 px-10 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-base shadow-lg shadow-[#16a34a]/20 group">
            Start Shopping <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  // --- MAIN CART CONTENT ---
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 min-h-screen bg-transparent">
      
      {/* Header */}
      <div className="mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Shopping Cart <span className="text-gray-400 font-medium text-2xl md:text-3xl ml-2">({cart.length} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 max-w-6xl mx-auto items-start">
        
        {/* --- LEFT: CART ITEMS LIST --- */}
        <div className="lg:col-span-7 space-y-6">
          {cart.map((item, index) => (
            <div
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
              className="group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Product Image */}
              <Link href={`/product/${item.id}`} className="relative h-28 w-24 sm:h-36 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 block">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Product Content */}
              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 leading-snug">
                      <Link href={`/product/${item.id}`} className="hover:text-[#16a34a] transition-colors">
                        {item.name}
                      </Link>
                    </h3>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.selectedColor,
                          item.selectedSize,
                        )
                      }
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 -mr-2 -mt-2 rounded-lg transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Variants (Color & Size) */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {item.selectedColor && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-gray-100 text-gray-600 capitalize border border-gray-200/50">
                        {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-gray-100 text-gray-600 capitalize border border-gray-200/50">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Quantity Control */}
                <div className="flex items-end justify-between mt-4">
                  {/* Price */}
                  <div>
                    <p className="text-lg sm:text-xl font-black text-[#16a34a]">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs font-medium text-gray-400 mt-0.5">
                        ৳{item.price.toLocaleString()} each
                      </p>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-200 rounded-xl h-10 sm:h-11 bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedColor,
                          item.selectedSize,
                          "minus",
                        )
                      }
                      className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#16a34a] transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900 border-x border-gray-100 h-full flex items-center justify-center bg-gray-50/50">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedColor,
                          item.selectedSize,
                          "plus",
                        )
                      }
                      className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#16a34a] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- RIGHT: ORDER SUMMARY --- */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 text-base">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">
                  ৳{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping Estimate</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">Free</span>
              </div>
            </div>

            <Separator className="my-6 border-gray-100" />

            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-[#16a34a]">
                ৳{cartTotal.toLocaleString()}
              </span>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button
                className="w-full cursor-pointer h-14 text-base font-bold rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg shadow-[#16a34a]/20 transition-all hover:-translate-y-0.5"
              >
                Proceed to Checkout
              </Button>
            </Link>

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-lg w-full">
                <ShieldCheck className="h-4 w-4 text-[#16a34a]" /> 
                Secure & Encrypted Checkout
              </div>
              
              <Link
                href="/product"
                className="text-sm font-semibold text-gray-500 hover:text-[#16a34a] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}