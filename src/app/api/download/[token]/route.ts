import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

/**
 * Secure digital delivery: validates ownership + paid status, then streams
 * the product package (a generated license/manifest bundle in this demo —
 * swap for a signed object-storage URL in production).
 */
export const GET = handle(
  async (_req: Request, ctx: { params: Promise<{ token: string }> }) => {
    const user = await requireUser();
    const { token } = await ctx.params;

    const item = await db.orderItem.findUnique({
      where: { downloadToken: token },
      include: { order: true, product: true },
    });

    if (!item || item.order.userId !== user.id) {
      return json({ error: "Download not found" }, 404);
    }
    if (item.order.status !== "PAID") {
      return json({ error: "Order is not paid yet" }, 403);
    }

    await db.orderItem.update({
      where: { id: item.id },
      data: { downloads: { increment: 1 } },
    });

    const p = item.product;
    const content = [
      "═══════════════════════════════════════════════════════",
      "  ⬡ PIXELVAULT — DIGITAL PRODUCT PACKAGE",
      "═══════════════════════════════════════════════════════",
      "",
      `  Product      : ${p.name}`,
      `  Category     : ${p.category}`,
      `  Version      : 2026.1`,
      `  Package size : ${p.fileSize}`,
      p.polyCount ? `  Poly count   : ${p.polyCount}` : null,
      p.rigType ? `  Rig          : ${p.rigType}` : null,
      p.blenderVersion ? `  Blender      : ${p.blenderVersion}` : null,
      "",
      "───────────────────────────────────────────────────────",
      "  ORDER",
      "───────────────────────────────────────────────────────",
      `  Order number : ${item.order.orderNumber}`,
      `  Licensee     : ${user.name} <${user.email}>`,
      `  Price paid   : ${formatPrice(item.price)}`,
      `  Purchased    : ${item.order.paidAt?.toISOString() ?? "-"}`,
      "",
      "───────────────────────────────────────────────────────",
      "  COMMERCIAL LICENSE",
      "───────────────────────────────────────────────────────",
      "  This license grants the licensee a non-exclusive,",
      "  worldwide, perpetual right to use this digital product",
      "  in personal and commercial projects. Redistribution or",
      "  resale of the source files is not permitted.",
      "",
      "  In a production deployment this endpoint would redirect",
      "  to a signed, expiring object-storage URL for the real",
      "  product archive.",
      "",
      "  Thank you for supporting independent creators! ⬡",
      "═══════════════════════════════════════════════════════",
    ]
      .filter((line) => line !== null)
      .join("\n");

    const filename = `pixelvault-${p.slug}-license.txt`;
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }
);
