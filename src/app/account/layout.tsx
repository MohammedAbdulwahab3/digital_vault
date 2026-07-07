import { AccountNav } from "./account-nav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[230px_1fr]">
      <AccountNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
