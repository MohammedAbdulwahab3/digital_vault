import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { handle, json } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const POST = handle(async (req: Request) => {
  const body = schema.parse(await req.json());

  const existing = await db.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return json({ error: "An account with this email already exists" }, 409);
  }

  const user = await db.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await hashPassword(body.password),
      avatarHue: Math.floor(Math.random() * 360),
    },
  });

  await createSession(user);
  return json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 201);
});
