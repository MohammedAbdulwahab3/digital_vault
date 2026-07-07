import { promises as fs } from "fs";
import path from "path";
import JSZip from "jszip";
import { formatPrice } from "./utils";

type PackagerProduct = {
  name: string;
  slug: string;
  description: string;
  category: string;
  fileSize: string;
  polyCount: string | null;
  rigType: string | null;
  blenderVersion: string | null;
};

type PackagerOrder = {
  orderNumber: string;
  paidAt: Date | null;
  price: number;
  buyerName: string;
  buyerEmail: string;
};

const TEMPLATES_ROOT = path.join(process.cwd(), "product-templates");

/** Category → theme colors used to brand the generated code. */
const THEME: Record<string, { primary: string; accent: string }> = {
  web: { primary: "#7c3aed", accent: "#06b6d4" },
  app: { primary: "#06b6d4", accent: "#7c3aed" },
  "ui-kit": { primary: "#ec4899", accent: "#a855f7" },
  "blender-3d": { primary: "#f97316", accent: "#06b6d4" },
};

/** Blender accessory per product, keyed by slug substring. */
function accessoryFor(slug: string) {
  if (slug.includes("ronin") || slug.includes("hero")) return "katana";
  if (slug.includes("mage")) return "staff";
  if (slug.includes("pilot")) return "helmet";
  return "antenna";
}

async function collectFiles(dir: string, base = dir): Promise<{ rel: string; abs: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: { rel: string; abs: string }[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(abs, base)));
    } else {
      files.push({ rel: path.relative(base, abs), abs });
    }
  }
  return files;
}

function licenseText(product: PackagerProduct, order: PackagerOrder) {
  return `═══════════════════════════════════════════════════════
  ⬡ PIXELVAULT — COMMERCIAL LICENSE
═══════════════════════════════════════════════════════

  Product      : ${product.name}
  Order        : ${order.orderNumber}
  Licensee     : ${order.buyerName} <${order.buyerEmail}>
  Price paid   : ${formatPrice(order.price)}
  Purchased    : ${order.paidAt?.toISOString() ?? "-"}

  This license grants the licensee a non-exclusive, worldwide,
  perpetual right to use this digital product in personal and
  commercial projects, including client work. Redistribution or
  resale of the source files as a template is not permitted.

  Thank you for supporting independent creators! ⬡
═══════════════════════════════════════════════════════
`;
}

/**
 * Builds a real, runnable code package for a purchased product:
 * the platform template tree with product branding substituted in,
 * plus a personalized commercial license.
 */
export async function buildPackage(
  platform: string,
  product: PackagerProduct,
  order: PackagerOrder
): Promise<Buffer> {
  const templateDir = path.join(TEMPLATES_ROOT, platform);
  const theme = THEME[product.category] ?? THEME.web;

  const tokens: Record<string, string> = {
    __PRODUCT_NAME__: product.name,
    __PRODUCT_SLUG__: product.slug,
    __PRODUCT_SLUG_UNDERSCORE__: product.slug.replace(/-/g, "_"),
    __PRODUCT_DESCRIPTION__: product.description,
    __PRIMARY__: theme.primary,
    __ACCENT__: theme.accent,
    __PRIMARY_HEX__: theme.primary.slice(1).toUpperCase(),
    __ACCENT_HEX__: theme.accent.slice(1).toUpperCase(),
    __BODY_COLOR__: "#2a2a3a",
    __ACCESSORY__: accessoryFor(product.slug),
    __YEAR__: String(new Date().getFullYear()),
  };

  const substitute = (content: string) =>
    Object.entries(tokens).reduce(
      (acc, [token, value]) => acc.split(token).join(value),
      content
    );

  const zip = new JSZip();
  const rootName = `${product.slug}-${platform}`;

  const files = await collectFiles(templateDir);
  for (const file of files) {
    const raw = await fs.readFile(file.abs, "utf-8");
    zip.file(`${rootName}/${file.rel}`, substitute(raw));
  }

  zip.file(`${rootName}/LICENSE.txt`, licenseText(product, order));

  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export async function platformAvailable(platform: string) {
  try {
    await fs.access(path.join(TEMPLATES_ROOT, platform));
    return true;
  } catch {
    return false;
  }
}
