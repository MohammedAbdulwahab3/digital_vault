import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handle, json } from "@/lib/api";

export const PATCH = handle(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const { role } = z
      .object({ role: z.enum(["USER", "ADMIN"]) })
      .parse(await req.json());

    if (id === admin.id) {
      return json({ error: "You can't change your own role" }, 400);
    }
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return json({ error: "User not found" }, 404);

    await db.user.update({ where: { id }, data: { role } });
    return json({ ok: true });
  }
);
