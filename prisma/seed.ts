import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const j = (arr: string[]) => JSON.stringify(arr);

const products = [
  // ─── WEB TEMPLATES ───────────────────────────────────────────────
  {
    slug: "nexa-pro-dashboard",
    name: "Nexa Pro Dashboard",
    category: "web",
    price: 4900,
    oldPrice: 7900,
    badge: "Best Seller",
    image: "/images/product-web-design.png",
    description:
      "Complete SaaS admin dashboard with 50+ components, dark/light themes and 12 prebuilt app pages.",
    longDescription:
      "Nexa Pro is a production-grade admin dashboard template built for modern SaaS products. It ships with 50+ hand-crafted components, 12 fully designed application pages (analytics, CRM, kanban, invoicing, settings), a complete auth flow, and a token-based theming system with dark and light modes. Every screen is responsive down to 320px and built on an 8pt spacing grid. Includes Figma source files plus production-ready HTML/React exports.",
    formats: j(["figma", "react", "html", "tailwind"]),
    features: j([
      "50+ reusable components",
      "12 application pages",
      "Dark & light theme tokens",
      "Auth flow screens included",
      "Figma + React + HTML source",
      "Lifetime free updates",
    ]),
    tags: j(["dashboard", "saas", "admin", "analytics"]),
    fileSize: "184 MB",
    featured: true,
    salesCount: 1240,
  },
  {
    slug: "aurora-landing-page",
    name: "Aurora Landing Page",
    category: "web",
    price: 2400,
    oldPrice: 3900,
    badge: null,
    image: "/images/product-web-design.png",
    description:
      "Modern SaaS landing page with dark/light mode, 9 sections and conversion-optimized layout.",
    longDescription:
      "Aurora is a conversion-focused SaaS landing template with 9 modular sections — hero, social proof, feature grid, pricing, FAQ, testimonials, CTA, blog teaser and footer. Built with semantic HTML and Tailwind, scoring 98+ on Lighthouse. The Figma file uses auto-layout throughout so sections can be remixed in minutes.",
    formats: j(["figma", "html", "tailwind"]),
    features: j([
      "9 modular sections",
      "98+ Lighthouse score",
      "Dark / light mode",
      "Auto-layout Figma file",
      "SEO-ready markup",
    ]),
    tags: j(["landing", "saas", "marketing"]),
    fileSize: "96 MB",
    salesCount: 890,
  },
  {
    slug: "atlas-agency-site",
    name: "Atlas Agency Site",
    category: "web",
    price: 3400,
    oldPrice: null,
    badge: "Staff Pick",
    image: "/images/product-web-design.png",
    description:
      "Award-style agency portfolio template with GSAP scroll animations and case-study layouts.",
    longDescription:
      "Atlas is an editorial-grade agency portfolio built for studios that want an awwwards-style presence. Includes smooth GSAP scroll choreography, a case-study article system, team and careers pages, and a working contact form. Ships as Figma + a Next.js codebase with all animations implemented.",
    formats: j(["figma", "nextjs", "gsap"]),
    features: j([
      "GSAP scroll animations",
      "Case study CMS structure",
      "Team & careers pages",
      "Next.js codebase included",
    ]),
    tags: j(["agency", "portfolio", "animation"]),
    fileSize: "142 MB",
    salesCount: 412,
  },
  // ─── APP TEMPLATES ───────────────────────────────────────────────
  {
    slug: "sync-finance-app",
    name: "Sync Finance App",
    category: "app",
    price: 3900,
    oldPrice: 5900,
    badge: "Popular",
    image: "/images/product-app-design.png",
    description:
      "Fintech mobile app UI with 30+ screens: onboarding, cards, transfers, analytics and crypto.",
    longDescription:
      "Sync is a complete fintech app UI kit with 30+ pixel-perfect screens covering onboarding, KYC, virtual cards, P2P transfers, spending analytics, and a crypto module. Designed on a 4pt grid with a full token set (colors, type, elevation) and light/dark variants for every screen. Includes interactive Figma prototype flows.",
    formats: j(["figma", "sketch"]),
    features: j([
      "30+ screens, light & dark",
      "Interactive prototype flows",
      "Full design token set",
      "iOS & Android layouts",
    ]),
    tags: j(["fintech", "mobile", "banking"]),
    fileSize: "118 MB",
    featured: true,
    salesCount: 1032,
  },
  {
    slug: "healthkit-app-design",
    name: "HealthKit App Design",
    category: "app",
    price: 3500,
    oldPrice: null,
    badge: "New",
    image: "/images/product-app-design.png",
    description:
      "Health & fitness app UI with workout tracker, meal planner and sleep analytics screens.",
    longDescription:
      "HealthKit covers the full journey of a modern fitness app: onboarding quiz, workout tracker with rest timers, meal planner with macro breakdowns, sleep analytics, challenges, and social feed. 42 screens with a friendly, rounded visual language and an accessible color system tested for WCAG AA.",
    formats: j(["figma"]),
    features: j([
      "42 screens",
      "WCAG AA color system",
      "Workout & meal modules",
      "Component library included",
    ]),
    tags: j(["health", "fitness", "mobile"]),
    fileSize: "104 MB",
    salesCount: 356,
  },
  {
    slug: "wander-travel-app",
    name: "Wander Travel App",
    category: "app",
    price: 2900,
    oldPrice: 4500,
    badge: null,
    image: "/images/product-app-design.png",
    description:
      "Travel booking app UI: discovery, trip planner, bookings, maps and immersive place pages.",
    longDescription:
      "Wander is a travel discovery and booking UI kit with cinematic place pages, a drag-to-reorder trip planner, flight & stay booking flows, and offline map states. 36 screens with a photography-first layout system and reusable card components.",
    formats: j(["figma", "sketch"]),
    features: j([
      "36 screens",
      "Booking & planner flows",
      "Photography-first layouts",
      "Reusable card system",
    ]),
    tags: j(["travel", "booking", "mobile"]),
    fileSize: "98 MB",
    salesCount: 274,
  },
  // ─── UI KITS ─────────────────────────────────────────────────────
  {
    slug: "quantum-ui-kit",
    name: "Quantum UI Kit",
    category: "ui-kit",
    price: 5900,
    oldPrice: 8900,
    badge: "Premium",
    image: "/images/product-ui-kit.png",
    description:
      "500+ components, 100+ screens and a full design system with tokens, variants and docs.",
    longDescription:
      "Quantum is a complete design system, not just a component dump: 500+ components with true Figma variants and properties, 100+ composed screens, a two-layer token architecture (primitive + semantic), typography and elevation scales, and written usage docs for every component family. The React export mirrors the Figma structure 1:1.",
    formats: j(["figma", "react", "storybook"]),
    features: j([
      "500+ components with variants",
      "100+ composed screens",
      "Two-layer token architecture",
      "Storybook docs included",
      "1:1 React export",
    ]),
    tags: j(["design-system", "components", "tokens"]),
    fileSize: "312 MB",
    featured: true,
    salesCount: 640,
  },
  {
    slug: "prism-mobile-kit",
    name: "Prism Mobile Kit",
    category: "ui-kit",
    price: 4400,
    oldPrice: null,
    badge: null,
    image: "/images/product-ui-kit.png",
    description:
      "Mobile-first UI kit with 280 components, native iOS & Material 3 variants side by side.",
    longDescription:
      "Prism gives you every core mobile pattern in both native iOS (SF-style) and Material 3 flavors, kept perfectly in sync: navigation, sheets, pickers, lists, cards, inputs and system states. 280 components, 60 sample screens, and a switcher token that flips an entire screen between platforms.",
    formats: j(["figma"]),
    features: j([
      "280 components",
      "iOS + Material 3 variants",
      "Platform switcher tokens",
      "60 sample screens",
    ]),
    tags: j(["mobile", "ios", "material"]),
    fileSize: "156 MB",
    salesCount: 298,
  },
  // ─── BLENDER 3D CHARACTERS ───────────────────────────────────────
  {
    slug: "cyber-ronin-character",
    name: "Cyber Ronin Character",
    category: "blender-3d",
    price: 7900,
    oldPrice: 9900,
    badge: "Premium",
    image: "/images/product-blender-character.png",
    description:
      "Fully rigged cyberpunk warrior with 50+ animations, PBR textures and modular armor system.",
    longDescription:
      "Cyber Ronin is a production-ready cyberpunk character for films, games and cinematics. Includes a full-body IK/FK rig with facial controls, 50+ baked animations (locomotion, combat, idles), 4K PBR texture sets with emissive variants, and a modular armor system with 18 swappable pieces. Clean quad topology, game-engine export presets for Unity and Unreal included.",
    formats: j(["blend", "fbx", "obj", "gltf"]),
    features: j([
      "Full body + facial rig",
      "50+ baked animations",
      "4K PBR textures, emissive variants",
      "18-piece modular armor",
      "Unity & Unreal export presets",
    ]),
    tags: j(["character", "cyberpunk", "rigged"]),
    polyCount: "52K",
    rigType: "Full Body + Facial",
    blenderVersion: "3.6+",
    renderer: "Cycles / EEVEE",
    fileSize: "1.2 GB",
    featured: true,
    salesCount: 487,
  },
  {
    slug: "luna-mage-fantasy",
    name: "Luna Mage Fantasy",
    category: "blender-3d",
    price: 5900,
    oldPrice: 7900,
    badge: "Best Seller",
    image: "/images/product-blender-character.png",
    description:
      "Stylized fantasy mage with hand-painted PBR textures, facial rig and 30+ spell animations.",
    longDescription:
      "Luna is a stylized fantasy mage built for cinematic storytelling. Hand-painted PBR textures, a full facial rig with 52 blendshapes, cloth-simulated robes, and 30+ spell-casting animation clips with matching VFX emitter empties. Includes a turntable scene with studio lighting ready to render.",
    formats: j(["blend", "fbx", "gltf"]),
    features: j([
      "Hand-painted PBR textures",
      "52 facial blendshapes",
      "30+ spell animations",
      "Cloth-simulated robes",
      "Lit turntable scene included",
    ]),
    tags: j(["character", "fantasy", "stylized"]),
    polyCount: "38K",
    rigType: "Full Body + Facial",
    blenderVersion: "3.4+",
    renderer: "EEVEE",
    fileSize: "860 MB",
    salesCount: 731,
  },
  {
    slug: "sci-fi-pilot-pack",
    name: "Sci-Fi Pilot Pack",
    category: "blender-3d",
    price: 4900,
    oldPrice: null,
    badge: "New",
    image: "/images/product-blender-character.png",
    description:
      "3 space pilot characters with modular armor, interchangeable helmets and cockpit poses.",
    longDescription:
      "A trio of space pilots designed to populate sci-fi scenes fast. Each character shares a common rig so animations retarget instantly, with modular armor plates, 6 interchangeable helmets, and a library of seated cockpit poses. Texture sets come in 3 faction colorways.",
    formats: j(["blend", "fbx", "obj", "gltf"]),
    features: j([
      "3 characters, shared rig",
      "6 interchangeable helmets",
      "3 faction colorways",
      "Cockpit pose library",
    ]),
    tags: j(["character", "scifi", "pack"]),
    polyCount: "45K each",
    rigType: "Full Body",
    blenderVersion: "3.5+",
    renderer: "Cycles",
    fileSize: "2.1 GB",
    salesCount: 289,
  },
  {
    slug: "low-poly-adventure-hero",
    name: "Low-Poly Adventure Hero",
    category: "blender-3d",
    price: 2900,
    oldPrice: null,
    badge: "Popular",
    image: "/images/product-blender-character.png",
    description:
      "Game-ready low-poly hero optimized for real-time. 30 animations and clean quad topology.",
    longDescription:
      "A charming low-poly adventurer built for real-time games and prototypes. 12K triangles, a single 2K texture atlas, 30 root-motion animations, and clean quad topology that subdivides gracefully. Tested in Unity, Unreal and Godot — import guides for each engine included.",
    formats: j(["blend", "fbx", "gltf"]),
    features: j([
      "12K tris, single 2K atlas",
      "30 root-motion animations",
      "Unity / Unreal / Godot guides",
      "Subdivision-safe topology",
    ]),
    tags: j(["character", "low-poly", "game-ready"]),
    polyCount: "12K tris",
    rigType: "Full Body",
    blenderVersion: "3.0+",
    renderer: "EEVEE / Game Engine",
    fileSize: "340 MB",
    salesCount: 954,
  },
  // ─── 3D MODELS ───────────────────────────────────────────────────
  {
    slug: "neo-city-props-kit",
    name: "Neo City Props Kit",
    category: "3d-model",
    price: 6400,
    oldPrice: 8400,
    badge: "Staff Pick",
    image: "/images/product-3d-model.png",
    description:
      "120+ modular cyberpunk city props: signage, kiosks, vehicles and street furniture.",
    longDescription:
      "Build dense cyberpunk streets in minutes. 120+ modular props — holographic signage, vendor kiosks, hover vehicles, cabling, vents and street furniture — all on a shared trim-sheet workflow for consistent texel density. Includes a demo street scene and an asset-browser catalog file for Blender.",
    formats: j(["blend", "fbx", "gltf"]),
    features: j([
      "120+ modular props",
      "Trim-sheet texture workflow",
      "Demo street scene",
      "Blender asset browser catalog",
    ]),
    tags: j(["props", "environment", "cyberpunk"]),
    polyCount: "800–9K per prop",
    rigType: null,
    blenderVersion: "3.2+",
    renderer: "Cycles / EEVEE",
    fileSize: "3.4 GB",
    salesCount: 351,
  },
  {
    slug: "isometric-room-builder",
    name: "Isometric Room Builder",
    category: "3d-model",
    price: 3900,
    oldPrice: null,
    badge: null,
    image: "/images/product-3d-model.png",
    description:
      "Snap-together isometric room kit with 200 furniture pieces and 8 styled room presets.",
    longDescription:
      "Create the isometric room renders you see all over dribbble. 200 furniture and decor pieces that snap to a grid, 8 fully styled room presets (studio, loft, gaming den, plant room…), plus a one-click camera and lighting rig tuned for that soft, toy-like look.",
    formats: j(["blend", "gltf"]),
    features: j([
      "200 snap-to-grid pieces",
      "8 styled room presets",
      "Preset camera + lighting rig",
      "Toy-look material library",
    ]),
    tags: j(["isometric", "interior", "stylized"]),
    polyCount: "500–4K per piece",
    rigType: null,
    blenderVersion: "3.0+",
    renderer: "EEVEE",
    fileSize: "1.8 GB",
    salesCount: 508,
  },
  // ─── ANIMATIONS ──────────────────────────────────────────────────
  {
    slug: "motion-flow-pack",
    name: "Motion Flow Pack",
    category: "animation",
    price: 4400,
    oldPrice: 6400,
    badge: "Popular",
    image: "/images/product-animation.png",
    description:
      "150 UI micro-interactions and hero animations as Lottie, Rive and After Effects files.",
    longDescription:
      "150 production-ready motion assets: button and toggle micro-interactions, loaders, success/error states, onboarding hero animations and empty-state loops. Every asset ships as Lottie JSON, Rive and the original After Effects project, with a web preview gallery to browse the whole pack.",
    formats: j(["lottie", "rive", "aep", "json"]),
    features: j([
      "150 motion assets",
      "Lottie + Rive + AE sources",
      "Web preview gallery",
      "Optimized under 40KB each",
    ]),
    tags: j(["motion", "lottie", "micro-interaction"]),
    fileSize: "420 MB",
    featured: true,
    salesCount: 823,
  },
  // ─── ILLUSTRATIONS ───────────────────────────────────────────────
  {
    slug: "pixel-folk-illustration-system",
    name: "Pixel Folk Illustration System",
    category: "illustration",
    price: 3400,
    oldPrice: 4900,
    badge: "New",
    image: "/images/product-2d-character.png",
    description:
      "Mix-and-match character illustration system: 40 characters, 120 poses, 300 props.",
    longDescription:
      "Pixel Folk is a modular illustration system for product teams. 40 diverse base characters, 120 poses, 300 props and 20 scene backgrounds — all built from shared components so every combination stays on-style. Recolor the whole system from a single palette panel. SVG and Figma sources included.",
    formats: j(["figma", "svg", "png"]),
    features: j([
      "40 characters × 120 poses",
      "300 props, 20 scenes",
      "One-palette recoloring",
      "SVG + Figma components",
    ]),
    tags: j(["illustration", "characters", "svg"]),
    fileSize: "260 MB",
    salesCount: 217,
  },
];

const reviewSeeds: Record<string, { user: number; rating: number; title: string; body: string }[]> = {
  "nexa-pro-dashboard": [
    { user: 0, rating: 5, title: "Saved us a full sprint", body: "We shipped our MVP admin in a week. Component quality is genuinely production-grade and the token system made rebranding painless." },
    { user: 1, rating: 5, title: "Best dashboard kit I've bought", body: "I've tried four dashboard templates this year. Nexa is the only one where the React code matches the Figma exactly." },
    { user: 2, rating: 4, title: "Great, docs could be deeper", body: "Beautiful screens and clean code. Would love more docs on the charting setup, but support answered within a day." },
  ],
  "cyber-ronin-character": [
    { user: 1, rating: 5, title: "Insane quality rig", body: "The facial rig alone is worth the price. Retargeted mocap onto the body rig with zero cleanup. Emissive texture variants look stunning in EEVEE." },
    { user: 3, rating: 5, title: "Used it in a shipped trailer", body: "We used Cyber Ronin as a hero character in a game trailer. Held up in 4K close-ups. Modular armor system is brilliant." },
  ],
  "luna-mage-fantasy": [
    { user: 0, rating: 5, title: "The blendshapes are fantastic", body: "52 blendshapes that actually work well together. The spell animation clips synced perfectly with my VFX." },
    { user: 2, rating: 4, title: "Beautiful stylized work", body: "Textures are gorgeous. Cloth sim needed a little tuning for my scene but the included turntable file helped a lot." },
    { user: 4, rating: 5, title: "Perfect for my short film", body: "Luna carried my animated short. Renders beautifully in EEVEE at a fraction of Cycles render time." },
  ],
  "quantum-ui-kit": [
    { user: 3, rating: 5, title: "A real design system", body: "This isn't a component dump — the two-layer token architecture is how we build internally. Adopted it as our team's foundation." },
    { user: 4, rating: 5, title: "Storybook export is 1:1", body: "Rare to see the code side treated this seriously. Variants map perfectly to props." },
  ],
  "sync-finance-app": [
    { user: 2, rating: 5, title: "Client approved instantly", body: "Presented the onboarding flow straight from the prototype. Client signed off same day." },
    { user: 0, rating: 4, title: "Very complete kit", body: "Dark mode variants for every single screen — that's the detail most kits skip." },
  ],
  "low-poly-adventure-hero": [
    { user: 4, rating: 5, title: "Dropped into Godot in minutes", body: "The Godot import guide is a lifesaver. Animations retargeted cleanly and it runs great on mobile." },
    { user: 1, rating: 4, title: "Great starter character", body: "Clean topology, sensible rig. Wish there were a few more facial options but excellent value." },
  ],
  "motion-flow-pack": [
    { user: 0, rating: 5, title: "Lottie files are tiny", body: "Every asset really is under 40KB. Our app bundle barely noticed 20 new animations." },
  ],
  "neo-city-props-kit": [
    { user: 3, rating: 5, title: "Trim sheets done right", body: "Consistent texel density across 120 props. Built an entire alley scene in one evening." },
  ],
};

async function main() {
  console.log("🌱 Seeding PixelVault…");

  // Wipe in dependency order
  await db.requestMessage.deleteMany();
  await db.customRequest.deleteMany();
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.wishlistItem.deleteMany();
  await db.product.deleteMany();
  await db.coupon.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.user.deleteMany();

  // ── Users ──
  const password = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  const admin = await db.user.create({
    data: { email: "admin@pixelvault.dev", name: "Ava Sterling", passwordHash: password, role: "ADMIN", avatarHue: 265 },
  });

  const demoUser = await db.user.create({
    data: { email: "user@pixelvault.dev", name: "Maya Rodriguez", passwordHash: userPassword, role: "USER", avatarHue: 190 },
  });

  const reviewerData = [
    { email: "alex.chen@example.com", name: "Alex Chen", avatarHue: 320 },
    { email: "sarah.miller@example.com", name: "Sarah Miller", avatarHue: 45 },
    { email: "james.park@example.com", name: "James Park", avatarHue: 145 },
    { email: "nina.osei@example.com", name: "Nina Osei", avatarHue: 15 },
    { email: "leo.tanaka@example.com", name: "Leo Tanaka", avatarHue: 220 },
  ];
  const reviewers = [];
  for (const r of reviewerData) {
    reviewers.push(
      await db.user.create({ data: { ...r, passwordHash: userPassword, role: "USER" } })
    );
  }

  // ── Products ──
  const created: Record<string, { id: string; price: number; name: string }> = {};
  for (const p of products) {
    const row = await db.product.create({ data: p });
    created[p.slug] = { id: row.id, price: row.price, name: row.name };
  }
  console.log(`  ✓ ${products.length} products`);

  // ── Reviews (+ product rating rollups) ──
  let reviewCount = 0;
  for (const [slug, reviews] of Object.entries(reviewSeeds)) {
    const product = created[slug];
    for (const r of reviews) {
      await db.review.create({
        data: {
          userId: reviewers[r.user].id,
          productId: product.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
        },
      });
      reviewCount++;
    }
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await db.product.update({
      where: { id: product.id },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length },
    });
  }
  console.log(`  ✓ ${reviewCount} reviews`);

  // ── Orders for the demo user (unlocks downloads + review rights) ──
  const orderSpecs = [
    { slugs: ["cyber-ronin-character", "quantum-ui-kit"], daysAgo: 21 },
    { slugs: ["nexa-pro-dashboard"], daysAgo: 9 },
    { slugs: ["motion-flow-pack", "low-poly-adventure-hero"], daysAgo: 2 },
  ];
  let orderIdx = 0;
  for (const spec of orderSpecs) {
    const items = spec.slugs.map((s) => created[s]);
    const subtotal = items.reduce((sum, i) => sum + i.price, 0);
    const when = new Date(Date.now() - spec.daysAgo * 86400000);
    await db.order.create({
      data: {
        orderNumber: `PV-SEED-${1000 + orderIdx++}`,
        userId: demoUser.id,
        status: "PAID",
        subtotal,
        total: subtotal,
        paymentMethod: "demo",
        createdAt: when,
        paidAt: when,
        items: {
          create: items.map((i) => ({ productId: i.id, name: i.name, price: i.price })),
        },
      },
    });
  }
  // A few extra orders from reviewers to feed admin analytics
  const extraSpecs: { user: number; slug: string; daysAgo: number }[] = [
    { user: 0, slug: "nexa-pro-dashboard", daysAgo: 34 },
    { user: 1, slug: "cyber-ronin-character", daysAgo: 28 },
    { user: 2, slug: "sync-finance-app", daysAgo: 19 },
    { user: 3, slug: "quantum-ui-kit", daysAgo: 14 },
    { user: 4, slug: "luna-mage-fantasy", daysAgo: 11 },
    { user: 1, slug: "motion-flow-pack", daysAgo: 6 },
    { user: 3, slug: "neo-city-props-kit", daysAgo: 4 },
    { user: 0, slug: "aurora-landing-page", daysAgo: 1 },
  ];
  for (const spec of extraSpecs) {
    const item = created[spec.slug];
    const when = new Date(Date.now() - spec.daysAgo * 86400000);
    await db.order.create({
      data: {
        orderNumber: `PV-SEED-${1000 + orderIdx++}`,
        userId: reviewers[spec.user].id,
        status: "PAID",
        subtotal: item.price,
        total: item.price,
        paymentMethod: "demo",
        createdAt: when,
        paidAt: when,
        items: { create: [{ productId: item.id, name: item.name, price: item.price }] },
      },
    });
  }
  console.log(`  ✓ ${orderIdx} orders`);

  // ── Custom requests ──
  const req1 = await db.customRequest.create({
    data: {
      userId: demoUser.id,
      title: "Custom mascot character for our dev tool",
      category: "blender-3d",
      description:
        "We need a friendly robot mascot for our CLI tool 'Fixie'. Rigged for simple idle/wave/celebrate loops, stylized to match our brand purple (#7C3AED). Target: hero renders for the website plus a low-poly variant for an interactive 3D widget.",
      budget: 120000,
      deadline: new Date(Date.now() + 30 * 86400000),
      status: "QUOTED",
      quoteAmount: 145000,
      quoteNote:
        "Includes concept sculpt round, full rig with 3 animation loops, 4K renders, and a <15K tri web-ready variant. Two revision rounds included.",
      createdAt: new Date(Date.now() - 5 * 86400000),
    },
  });
  await db.requestMessage.createMany({
    data: [
      { requestId: req1.id, senderId: demoUser.id, body: "Attached our brand guide in the description — the robot should feel friendly, not industrial. Think Wall-E meets a stack of terminal windows. 🙂", createdAt: new Date(Date.now() - 5 * 86400000 + 3600000) },
      { requestId: req1.id, senderId: admin.id, body: "Love this brief! A couple of questions: 1) Do you need the web variant rigged too, or static poses are fine? 2) Any preference between hard-surface and soft/rounded shapes?", createdAt: new Date(Date.now() - 4 * 86400000) },
      { requestId: req1.id, senderId: demoUser.id, body: "Web variant can be static with 3 poses. Rounded shapes please — accessibility of the brand matters to us.", createdAt: new Date(Date.now() - 4 * 86400000 + 7200000) },
      { requestId: req1.id, senderId: admin.id, body: "Perfect. I've sent a formal quote — includes a concept round so you can steer the design before we sculpt. Timeline is 3 weeks from acceptance.", createdAt: new Date(Date.now() - 3 * 86400000) },
    ],
  });

  const req2 = await db.customRequest.create({
    data: {
      userId: demoUser.id,
      title: "Landing page for AI startup launch",
      category: "web",
      description:
        "Series-A AI startup launching in 6 weeks. Need a landing page in the style of Linear/Vercel — dark, fast, subtle motion. Copy is ready; we need design + build (Next.js preferred).",
      budget: 350000,
      status: "IN_PROGRESS",
      quoteAmount: 320000,
      quoteNote: "Design + Next.js build, 2 revision rounds, deployed to your Vercel.",
      createdAt: new Date(Date.now() - 16 * 86400000),
    },
  });
  await db.requestMessage.createMany({
    data: [
      { requestId: req2.id, senderId: admin.id, body: "First design draft is in your inbox — hero section has two motion directions to pick from (particle field vs. gradient mesh).", createdAt: new Date(Date.now() - 8 * 86400000) },
      { requestId: req2.id, senderId: demoUser.id, body: "Gradient mesh, 100%. The particle one feels a bit 2019. Ship it 🚀", createdAt: new Date(Date.now() - 7 * 86400000) },
    ],
  });

  await db.customRequest.create({
    data: {
      userId: reviewers[2].id,
      title: "Explainer animation for onboarding",
      category: "animation",
      description:
        "60-second product explainer in flat illustration style, needs Lottie export for in-app playback plus 1080p video for socials.",
      budget: 80000,
      status: "PENDING",
      createdAt: new Date(Date.now() - 1 * 86400000),
    },
  });
  console.log("  ✓ 3 custom requests with message threads");

  // ── Coupons ──
  await db.coupon.createMany({
    data: [
      { code: "WELCOME10", percentOff: 10, maxUses: 10000 },
      { code: "CREATOR25", percentOff: 25, maxUses: 500 },
    ],
  });
  console.log("  ✓ 2 coupons (WELCOME10, CREATOR25)");

  console.log("\n✅ Seed complete.");
  console.log("   Admin  → admin@pixelvault.dev / Admin123!");
  console.log("   User   → user@pixelvault.dev  / User123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
