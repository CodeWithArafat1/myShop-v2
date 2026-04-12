"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function CartButton() {
  const { cart, setIsOpen, isLoading } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingBag className="h-5 w-5" />
      
   
      {!isLoading && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
          {totalItems}
        </span>
      )}
    </Button>
  );
}