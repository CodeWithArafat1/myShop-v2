"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";

const generateOrderId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${random}-${date}`;
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, isLoading } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "Bangladesh",
  });

  useEffect(() => {
    if (!isLoading && cart.length === 0 && !showSuccessModal) {
      router.push("/shop");
    }
  }, [cart, isLoading, router, showSuccessModal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();

      const orderData = {
        orderId: orderId,
        customer: formData,
        items: cart,
        totalAmount: cartTotal,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        date: new Date().toISOString(),
      };

      const response = await fetch(
        "https://my-shop-t2x7.vercel.app/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        },
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to place order");
      }

      setGeneratedOrderId(orderId);

      const myOrders = JSON.parse(localStorage.getItem("my_orders") || "[]");
      if (!myOrders.includes(orderId)) {
        myOrders.push(orderId);
        localStorage.setItem("my_orders", JSON.stringify(myOrders));
      }

      localStorage.setItem("last_order_id", orderId);

      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen max-w-6xl">
        <div className="h-8 w-48 animate-pulse rounded mb-10 bg-muted"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="h-[400px] lg:col-span-7 bg-muted animate-pulse rounded-2xl"></div>
          <div className="h-[400px] lg:col-span-5 bg-muted animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !showSuccessModal) return null;

  return (
    <div className="min-h-screen pb-16 ">
      {/* Header Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl flex items-center justify-between">
          <Link
            href="/cart"
            className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Cart
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Checkout</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Form Section (Left side) */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-8 flex flex-col h-full">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
                <MapPin className="h-6 w-6 text-[#16a34a]" />
                Shipping Details
              </h2>

              <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="h-12"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="e.g. +880 1712-345678"
                    className="h-12"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="House number, street name, area"
                    className="min-h-[100px] resize-none"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city">City / District</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g. Dhaka"
                      className="h-12"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value="Bangladesh"
                      disabled
                      className="h-12 bg-muted/50 text-muted-foreground"
                    />
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Payment Method</h3>
                  <div className="border-2 border-[#16a34a] rounded-xl p-5 flex items-center justify-between bg-[#16a34a]/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-6 rounded-full border-2 border-[#16a34a] flex items-center justify-center shrink-0">
                        <div className="h-3 w-3 rounded-full bg-[#16a34a]" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Pay with cash upon delivery.
                        </p>
                      </div>
                    </div>
                    <Truck className="h-8 w-8 text-[#16a34a] opacity-80 shrink-0" />
                  </div>
                </div>

                {/* Mobile Submit Button (Hidden on Desktop) */}
                <div className="lg:hidden mt-8">
                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full cursor-pointer h-14 text-base font-bold rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg shadow-[#16a34a]/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      "Place Order Now"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Section (Right side) */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>

              <div className="p-6">
                <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center mt-2 group">
                      <div className="relative h-16 w-16 shrink-0">
                        {/* Badge: Positioned outside the box, now visible because overflow is visible */}
                        <div className="absolute -top-2 -right-2 h-5 w-5 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-[10px] font-bold z-20 border-2 border-white shadow-sm">
                          {item.quantity}
                        </div>

                        {/* Image Wrapper: Applied 'overflow-hidden' and 'rounded-xl' here instead */}
                        <div className="relative h-full w-full rounded-xl overflow-hidden border border-gray-100 bg-white">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {item.selectedColor && `${item.selectedColor}`}
                          {item.selectedColor && item.selectedSize && " • "}
                          {item.selectedSize && `${item.selectedSize}`}
                        </p>
                      </div>

                      {/* Fixed Quantity Wrapping */}
                      <div className="text-sm font-extrabold text-gray-900 whitespace-nowrap">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-5" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ৳{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                </div>

                <Separator className="mb-5" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#16a34a]">
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Desktop Submit Button (Hidden on Mobile) */}
                <div className="hidden lg:block">
                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full h-14 text-base font-bold rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg shadow-[#16a34a]/20 transition-all hover:-translate-y-0.5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Processing Order...
                      </>
                    ) : (
                      "Place Order Now"
                    )}
                  </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-[#16a34a]" />
                  Safe & Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal}>
        <DialogContent
          className="sm:max-w-md text-center p-8 border-none shadow-2xl rounded-2xl"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="h-10 w-10 text-[#16a34a]" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-gray-900">
              Order Confirmed!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Thank you for your purchase. We have received your order.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 my-4">
            <p className="text-sm text-gray-500 font-medium mb-1">
              Your Order ID
            </p>
            <p className="text-xl font-mono font-black text-[#16a34a] tracking-wider">
              {generatedOrderId}
            </p>
          </div>

          <DialogFooter className="mt-2">
            <Link href="/track-order" className="w-full">
              <Button className="w-full h-12 text-base font-bold bg-[#16a34a] hover:bg-[#15803d] rounded-xl">
                Track My Order
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
