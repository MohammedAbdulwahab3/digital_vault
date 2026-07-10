"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, type CartLine } from "@/components/store-provider";
import { useLang } from "@/components/language-provider";

export function ProductActions({
  product,
  owned,
}: {
  product: CartLine;
  owned: boolean;
}) {
  const { addToCart, toggleWishlist, wishlist, setCartOpen, cart } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const wishlisted = wishlist.includes(product.productId);
  const inCart = cart.some((c) => c.productId === product.productId);

  if (owned) {
    return (
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href="/account/orders" className="btn-primary flex-1 !py-3">
          {t.product.ownedDownload}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      {inCart ? (
        <button onClick={() => setCartOpen(true)} className="btn-primary flex-1 !py-3">
          {t.product.inCartView}
        </button>
      ) : (
        <button
          onClick={async () => {
            await addToCart(product);
            setCartOpen(true);
          }}
          className="btn-primary flex-1 !py-3"
        >
          {t.product.addToCart}
        </button>
      )}
      <button
        onClick={async () => {
          if (!inCart) await addToCart(product);
          router.push("/checkout");
        }}
        className="btn-outline flex-1 !py-3"
      >
        {t.product.buyNow}
      </button>
      <button
        onClick={() => toggleWishlist(product.productId)}
        className="btn-outline !px-4 !py-3"
        aria-label="Toggle wishlist"
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
