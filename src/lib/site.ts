/**
 * URL canónica do site (OG, metadataBase, sitemap). Opcional: `NEXT_PUBLIC_SITE_URL`
 * para outro ambiente — valor sem barra final.
 */
function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && /^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, "");
  }
  return "https://braslareletros.com.br";
}

const categoryNav = [
  { label: "Carina", href: "/carina" },
  { label: "New Sirirus", href: "/new-sirirus" },
  { label: "Asiático", href: "/asiatico" },
  { label: "Cooktop", href: "/cooktops" },
] as const;

const imprensaNav = { label: "Imprensa", href: "/imprensa" } as const;
const nossaHistoriaNav = {
  label: "Nossa história",
  href: "/nossa-historia",
} as const;
const contatoNav = { label: "Contato", href: "/contato" } as const;

const institucionalNav = [imprensaNav, nossaHistoriaNav, contatoNav] as const;

/** Canais oficiais de atendimento (página /contato). */
const contact = {
  phoneDisplay: "(42) 3220-5650",
  phoneTel: "tel:+554232205650",
  whatsappUrl: "https://wa.me/554232205650",
  supportEmail: "sac@fogoesbraslar.com.br",
  hoursSummary: "de segunda a sexta, das 7h30 às 17h18",
} as const;

const socialNav = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/geral_since_1914",
    network: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/geralfogoesalenha",
    network: "facebook",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    network: "tiktok",
  },
] as const;

export const SITE = {
  /** Nome exibido em títulos, metadata e interface. */
  name: "Braslar Eletrodomésticos",
  description:
    "Braslar Eletrodomésticos — fogões, cooktops, fornos a lenha, refrigeradores e soluções para casa e negócio, com qualidade e design.",
  url: getSiteUrl(),
  categoryNav,
  imprensaNav,
  nossaHistoriaNav,
  contatoNav,
  institucionalNav,
  contact,
  socialNav,
  nav: [...categoryNav, ...institucionalNav],
} as const;
