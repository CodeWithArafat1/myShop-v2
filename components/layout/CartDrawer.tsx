import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const CartDrawer = ({ children }: { children: React.ReactNode }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Shopping Bag ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">Your cart is empty</h3>
                <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
              </div>
              <Button onClick={() => toast.info('Happy shopping!')} className="rounded-xl px-8">Start Shopping</Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-6">
              <div className="space-y-6 py-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 rounded-lg overflow-hidden border shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-primary font-bold">৳{item.price}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">
                          Total: ৳{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-6 border-t bg-secondary/10 sm:flex-col space-y-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-bold">FREE</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>৳{subtotal}</span>
              </div>
            </div>
            <Button onClick={() => toast.success('Proceeding to checkout...')} className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-accent text-white font-bold">
              Checkout Now
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;