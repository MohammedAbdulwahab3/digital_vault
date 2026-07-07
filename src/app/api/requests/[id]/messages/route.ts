import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";

/** Post a message on a request thread (owner or admin only). */
export const POST = handle(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const user = await requireUser();
    const { id } = await ctx.params;
    const { body } = z
      .object({ body: z.string().min(1).max(4000) })
      .parse(await req.json());

    const request = await db.customRequest.findUnique({ where: { id } });
    if (!request || (request.userId !== user.id && user.role !== "ADMIN")) {
      return json({ error: "Request not found" }, 404);
    }

    const message = await db.requestMessage.create({
      data: { requestId: id, senderId: user.id, body },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
    await db.customRequest.update({ where: { id }, data: { updatedAt: new Date() } });

    return json({ message }, 201);
  }
);
