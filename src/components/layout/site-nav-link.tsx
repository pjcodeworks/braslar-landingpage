import Link from "next/link";
import type { ReactNode } from "react";

type SiteNavLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

/** Rotas internas (`/…`) usam Next `Link`; âncoras (`#`) e URLs externas usam `<a>`. */
export function SiteNavLink({ href, className, children, onClick }: SiteNavLinkProps) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  if (internal) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
