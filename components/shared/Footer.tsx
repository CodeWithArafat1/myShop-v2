"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-[#0f1f17] to-[#1b2f25] text-gray-300">
      <div className="container mx-auto px-6 lg:px-12 py-16">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Rongila <span className="text-green-500">Saree</span>
            </h2>

            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Premium sarees for the modern woman. <br />
              Tradition meets contemporary style.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">

              {/* Facebook */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-green-500 transition-all"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15c-1.3 0-1.7.8-1.7 1.6V12H17l-.5 3h-3.2v7A10 10 0 0022 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-green-500 transition-all"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.3a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM12 9a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-green-500 transition-all"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z" />
                </svg>
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Shop", "Categories", "About"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-green-500 transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Contact Us",
                "Shipping Policy",
                "Return Policy",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-green-500 transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-white font-semibold mb-4">Payment</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We accept bKash, Nagad, Visa, Mastercard, and Cash on Delivery.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Rongila Saree. All rights reserved.
        </div>

      </div>
    </footer>
  );
}