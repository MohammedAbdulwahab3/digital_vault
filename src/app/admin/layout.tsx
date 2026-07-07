import { AdminNav } from "./admin-nav";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 lg:grid-cols-[220px_1fr]">
      <AdminNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
