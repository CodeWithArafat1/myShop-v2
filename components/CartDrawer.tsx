"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isOpen, setIsOpen, cartTotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background p-0 border-l">
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Shopping Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-6">
            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-lg">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Looks like you haven't added anything yet.
            </p>
            <Button onClick={() => setIsOpen(false)} variant="outline" className="mt-4">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="flex gap-4 group">
                    <div className="relative h-24 w-20 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-sm leading-tight line-clamp-2">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-2 -mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                          {item.selectedColor && (
                            <span className="flex items-center gap-1">
                              Color: <span className="w-2 h-2 rounded-full inline-block border" style={{ backgroundColor: item.selectedColor.toLowerCase() }}></span> {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>Size: {item.selectedSize}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <div className="flex items-center border rounded-md h-7">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, "minus")}
                            className="w-7 h-full flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, "plus")}
                            className="w-7 h-full flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="font-bold text-sm">৳{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-6 bg-muted/30 dark:bg-background space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-base font-semibold text-foreground">
                  <span>Subtotal</span>
                  <span>৳{cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              </div>

              <Button className="w-full h-12 text-base" asChild onClick={() => setIsOpen(false)}>
                <Link href="/checkout">Check Out</Link>
              </Button>

              <Button variant="outline" className="w-full h-12 text-base" asChild onClick={() => setIsOpen(false)}>
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}