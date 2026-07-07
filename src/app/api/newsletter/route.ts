import { z } from "zod";
import { db } from "@/lib/db";
import { handle, json } from "@/lib/api";

export const POST = handle(async (req: Request) => {
  const { email } = z
    .object({ email: z.string().email().toLowerCase() })
    .parse(await req.json());

  await db.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });
  return json({ ok: true });
});
