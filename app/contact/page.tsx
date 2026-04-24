"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    // 🔥 ফর্মের রেফারেন্সটি আগেই একটি ভ্যারিয়েবলে সেভ করে রাখছি
    const formElement = event.currentTarget;

    const formData = new FormData(formElement);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        formElement.reset(); // 🔥 এখানে সেভ করা রেফারেন্সটি ক্লিয়ার করছি
        
        // ৫ সেকেন্ড পর আবার আগের অবস্থায় ফিরে যাবে যেন চাইলে নতুন মেসেজ পাঠাতে পারে
        setTimeout(() => setStatus("idle"), 5000); 
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 sm:py-24 px-6 lg:px-12 ">
      <div className="container mx-auto max-w-2xl bg-white/50 rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
        
        {/* ================= SUCCESS STATE ================= */}
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              ধন্যবাদ!
            </h2>
            <p className="text-gray-500 text-lg max-w-md">
              আপনার মেসেজটি সফলভাবে আমাদের কাছে পৌঁছেছে। আমরা খুব শিগগিরই আপনার সাথে যোগাযোগ করব।
            </p>
            <Button 
              onClick={() => setStatus("idle")}
              variant="outline"
              className="mt-8 border-[#16a34a] text-[#16a34a] hover:bg-green-50"
            >
              আরেকটি মেসেজ পাঠান
            </Button>
          </div>
        ) : (
          
          /* ================= NORMAL FORM STATE ================= */
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                যোগাযোগ করুন
              </h2>
              <p className="text-gray-500">
                আপনার যেকোনো প্রশ্ন বা মতামত আমাদের লিখে জানান।
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  আপনার নাম
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="যেমন: John Doe"
                  required
                  className="h-12 bg-gray-50/50"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  ইমেইল অ্যাড্রেস
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  required
                  className="h-12 bg-gray-50/50"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700"
                >
                  আপনার মেসেজ
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="এখানে আপনার মেসেজ লিখুন..."
                  rows={5}
                  required
                  className="resize-none bg-gray-50/50"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 bg-[#16a34a] hover:bg-[#15803d] text-white text-base font-semibold rounded-lg transition-all"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    পাঠানো হচ্ছে...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" /> মেসেজ পাঠান
                  </span>
                )}
              </Button>

              {/* Error Message */}
              {status === "error" && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium mt-4">
                  <AlertCircle className="w-5 h-5" />
                  দুঃখিত, কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।
                </div>
              )}
            </form>
          </>
        )}
      </div>

          {/* Contact Info Footer */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm sm:text-base">
            If you have any further questions, please don't hesitate to contact us at <br />
            <a href="mailto:support@neelnir.com" className="text-primary font-semibold hover:underline">support@neelnir.com</a> or call us at <span className="font-semibold text-foreground">01772-162533</span>.
          </p>
        </div>
    </section>
  );
}