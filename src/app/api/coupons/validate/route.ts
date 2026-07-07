import { z } from "zod";
import { db } from "@/lib/db";
import { handle, json } from "@/lib/api";

export const POST = handle(async (req: Request) => {
  const { code } = z.object({ code: z.string().max(40) }).parse(await req.json());
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.active || coupon.uses >= coupon.maxUses) {
    return json({ valid: false, error: "Invalid or expired coupon code" }, 404);
  }
  return json({ valid: true, code: coupon.code, percentOff: coupon.percentOff });
});
