/**
 * Chapa — Ethiopian payment gateway (Telebirr, CBE Birr, M-Pesa, cards).
 * https://developer.chapa.co
 *
 * Set CHAPA_SECRET_KEY to activate hosted checkout in ETB. Amounts are
 * converted from stored USD cents at NEXT_PUBLIC_ETB_RATE.
 */

import { toEtb } from "./utils";

const CHAPA_API = "https://api.chapa.co/v1";

export function chapaEnabled() {
  return Boolean(process.env.CHAPA_SECRET_KEY);
}

type ChapaInitResponse = {
  status: string;
  message: string;
  data?: { checkout_url: string };
};

export async function chapaInitialize(params: {
  amountUsdCents: number;
  email: string;
  firstName: string;
  txRef: string;
  returnUrl: string;
  title: string;
}): Promise<{ checkoutUrl: string }> {
  const res = await fetch(`${CHAPA_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(toEtb(params.amountUsdCents)),
      currency: "ETB",
      email: params.email,
      first_name: params.firstName,
      tx_ref: params.txRef,
      return_url: params.returnUrl,
      "customization[title]": params.title.slice(0, 16),
    }),
  });
  const data = (await res.json()) as ChapaInitResponse;
  if (!res.ok || data.status !== "success" || !data.data?.checkout_url) {
    throw new Error(`Chapa initialize failed: ${data.message ?? res.status}`);
  }
  return { checkoutUrl: data.data.checkout_url };
}

export async function chapaVerify(txRef: string): Promise<boolean> {
  const res = await fetch(`${CHAPA_API}/transaction/verify/${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
  });
  if (!res.ok) return false;
  const data = (await res.json()) as {
    status: string;
    data?: { status?: string };
  };
  return data.status === "success" && data.data?.status === "success";
}
