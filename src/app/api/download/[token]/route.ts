import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { parseJsonArray } from "@/lib/utils";
import { buildPackage, platformAvailable } from "@/lib/packager";

/**
 * Secure digital delivery: validates ownership + paid status, then builds
 * and streams the real code package for the requested platform
 * (?platform=nextjs|react|flutter|blender).
 */
export const GET = handle(
  async (req: Request, ctx: { params: Promise<{ token: string }> }) => {
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

    const platforms = parseJsonArray(item.product.platforms);
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform") ?? platforms[0];

    if (!platform || !platforms.includes(platform) || !(await platformAvailable(platform))) {
      return json(
        { error: `Platform not available. Choose one of: ${platforms.join(", ")}` },
        400
      );
    }

    await db.orderItem.update({
      where: { id: item.id },
      data: { downloads: { increment: 1 } },
    });

    const buffer = await buildPackage(platform, item.product, {
      orderNumber: item.order.orderNumber,
      paidAt: item.order.paidAt,
      price: item.price,
      buyerName: user.name,
      buyerEmail: user.email,
    });

    const filename = `${item.product.slug}-${platform}.zip`;
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  }
);
