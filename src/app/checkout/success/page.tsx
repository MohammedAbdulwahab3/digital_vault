import { Suspense } from "react";
import { SuccessView } from "./success-view";

export const metadata = { title: "Order Complete" };

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessView />
    </Suspense>
  );
}
