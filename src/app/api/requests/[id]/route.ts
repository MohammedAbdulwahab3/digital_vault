import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { REQUEST_STATUSES } from "@/lib/catalog";

const adminSchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  quoteAmount: z.number().int().min(0).nullable().optional(),
  quoteNote: z.string().max(2000).nullable().optional(),
});

const userSchema = z.object({
  action: z.enum(["accept_quote", "decline_quote", "mark_completed"]),
});

/**
 * PATCH — admins manage status/quote; owners respond to quotes
 * (accept/decline) and confirm delivery.
 */
export const PATCH = handle(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const user = await requireUser();
    const { id } = await ctx.params;
    const body = await req.json();

    const request = await db.customRequest.findUnique({ where: { id } });
    if (!request) return json({ error: "Request not found" }, 404);

    if (user.role === "ADMIN") {
      const data = adminSchema.parse(body);
      const updated = await db.customRequest.update({
        where: { id },
        data: {
          ...(data.status ? { status: data.status } : {}),
          ...(data.quoteAmount !== undefined ? { quoteAmount: data.quoteAmount } : {}),
          ...(data.quoteNote !== undefined ? { quoteNote: data.quoteNote } : {}),
          // Setting a quote moves the request into QUOTED unless overridden
          ...(data.quoteAmount != null && !data.status ? { status: "QUOTED" } : {}),
        },
      });
      return json({ request: updated });
    }

    if (request.userId !== user.id) return json({ error: "Request not found" }, 404);

    const { action } = userSchema.parse(body);
    if (action === "accept_quote" || action === "decline_quote") {
      if (request.status !== "QUOTED") {
        return json({ error: "No open quote on this request" }, 400);
      }
      const updated = await db.customRequest.update({
        where: { id },
        data: { status: action === "accept_quote" ? "ACCEPTED" : "DECLINED" },
      });
      return json({ request: updated });
    }
    // mark_completed
    if (request.status !== "DELIVERED") {
      return json({ error: "Request has not been delivered yet" }, 400);
    }
    const updated = await db.customRequest.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    return json({ request: updated });
  }
);
