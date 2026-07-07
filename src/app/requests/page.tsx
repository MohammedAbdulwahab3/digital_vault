import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal, SectionHeader } from "@/components/ui";
import { CATEGORIES } from "@/lib/catalog";

export const metadata = { title: "Custom Design Requests" };

const STEPS = [
  { icon: "📝", title: "Describe your vision", body: "Tell us what you need — a rigged character, a landing page, an explainer animation. Attach budget and timeline." },
  { icon: "💰", title: "Get a quote", body: "Our team reviews your brief and responds with a fixed quote and timeline, usually within 24 hours." },
  { icon: "💬", title: "Collaborate", body: "Accept the quote and chat directly with your creator through the request thread. Revisions included." },
  { icon: "🚀", title: "Receive & own it", body: "Get production-ready files with full commercial rights. Your request, your asset — exclusively." },
];

export default function RequestsLandingPage() {
  return (
    <>
      <section className="noise relative overflow-hidden py-24">
        <div className="orb -right-40 -top-40 h-[600px] w-[600px] animate-pulse-slow bg-pink-brand/10" />
        <div className="orb -left-32 bottom-0 h-[400px] w-[400px] bg-violet-brand/15" />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="mb-5 inline-block rounded-full border border-pink-brand/30 bg-pink-brand/10 px-4 py-1.5 text-sm font-medium text-pink-brand">
            ✨ Bespoke work by the PixelVault team
          </span>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Can't find it?{" "}
            <span className="text-gradient-warm">Commission it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fog-2">
            From rigged Blender characters to full product websites — submit a
            brief, get a quote within 24h, and collaborate with world-class
            designers in a private thread.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/account/requests/new" className="btn-primary !px-8 !py-3 !text-base">
              Start a request →
            </Link>
            <Link href="/account/requests" className="btn-outline !px-8 !py-3 !text-base">
              My requests
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          eyebrow="How it works"
          title={<>From brief to delivery in <span className="text-gradient">4 steps</span></>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="gradient-ring glass relative h-full rounded-2xl p-7">
                <span className="absolute right-5 top-4 font-display text-4xl font-bold text-white/5">
                  0{i + 1}
                </span>
                <span className="text-3xl">{step.icon}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog-2">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-ink-2/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Capabilities"
            title={<>What we <span className="text-gradient">build</span></>}
            subtitle="Every category in the marketplace is available as custom work."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 0.05}>
                <div className="glass flex h-full flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-xl`}>
                    {cat.icon}
                  </span>
                  <span className="text-sm font-bold leading-tight">{cat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/account/requests/new" className="btn-primary !px-8 !py-3">
              Submit your brief →
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
