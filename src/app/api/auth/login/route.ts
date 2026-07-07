import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { handle, json } from "@/lib/api";

const schema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export const POST = handle(async (req: Request) => {
  const body = schema.parse(await req.json());

  const user = await db.user.findUnique({ where: { email: body.email } });
  if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
    return json({ error: "Invalid email or password" }, 401);
  }

  await createSession(user);
  return json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
