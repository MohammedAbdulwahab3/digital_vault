"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store-provider";
import { formatPrice } from "@/lib/utils";
import { categoryLabel } from "@/lib/catalog";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, user } = useStore();
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const checkout = () => {
    setCartOpen(false);
    router.push(user ? "/checkout" : "/login?next=/checkout");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-2"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <h2 className="font-display text-lg font-bold">
                Your Cart{" "}
                <span className="ml-1 text-sm font-normal text-fog-2">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-fog-2 transition hover:bg-white/5 hover:text-fog"
                aria-label="Close cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="text-5xl opacity-40">🛒</span>
                  <p className="text-fog-2">Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)} className="btn-outline mt-2 !py-2 text-sm">
                    <Link href="/products">Browse products</Link>
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {cart.map((item) => (
                    <motion.li
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="glass flex items-center gap-3 rounded-2xl p-3"
                    >
                      <Link href={`/products/${item.slug}`} onClick={() => setCartOpen(false)}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="block truncate text-sm font-semibold transition hover:text-purple-brand"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-fog-2">{categoryLabel(item.category)}</p>
                      </div>
                      <span className="text-sm font-bold text-cyan-brand">{formatPrice(item.price)}</span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="rounded-full p-1.5 text-fog-2 transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/5 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-fog-2">Total</span>
                  <span className="font-display text-2xl font-bold text-gradient">
                    {formatPrice(total)}
                  </span>
                </div>
                <button onClick={checkout} className="btn-primary w-full !py-3">
                  {user ? "Proceed to Checkout →" : "Sign in to Checkout →"}
                </button>
                <p className="mt-3 text-center text-xs text-fog-2">
                  Instant download after payment · 30-day money-back guarantee
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
