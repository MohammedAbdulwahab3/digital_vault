import { getCurrentUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";

export const GET = handle(async () => {
  const user = await getCurrentUser();
  return json({
    user: user
      ? { id: user.id, name: user.name, email: user.email, role: user.role }
      : null,
  });
});
