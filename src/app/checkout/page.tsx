import { Suspense } from "react";
import { CheckoutView } from "./checkout-view";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutView />
    </Suspense>
  );
}
