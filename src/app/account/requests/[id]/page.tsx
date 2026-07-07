import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { RequestThread } from "@/components/request-thread";

export const dynamic = "force-dynamic";
export const metadata = { title: "Request Thread" };

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/requests");
  const { id } = await params;

  const request = await db.customRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { slug: true, name: true, image: true } },
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!request || (request.userId !== user.id && user.role !== "ADMIN")) notFound();

  return (
    <div>
      <Link
        href="/account/requests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-fog-2 transition hover:text-fog"
      >
        ← All requests
      </Link>
      <RequestThread
        request={{
          id: request.id,
          title: request.title,
          category: request.category,
          description: request.description,
          budget: request.budget,
          deadline: request.deadline?.toISOString() ?? null,
          status: request.status,
          quoteAmount: request.quoteAmount,
          quoteNote: request.quoteNote,
          createdAt: request.createdAt.toISOString(),
          user: request.user,
          product: request.product,
        }}
        messages={request.messages.map((m) => ({
          id: m.id,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
          sender: m.sender,
        }))}
        viewerId={user.id}
        isAdmin={user.role === "ADMIN"}
      />
    </div>
  );
}
