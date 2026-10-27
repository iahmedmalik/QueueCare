export type PublicLink = { href: string; label: string; external?: boolean };

/** Public links, shown in the header on wide screens and in the footer everywhere. */
export const PUBLIC_LINKS: readonly PublicLink[] = [
  { href: "https://github.com/iahmedmalik/QueueCare#readme", label: "How this was built", external: true },
];

/** The footer also links to the privacy page. */
export const FOOTER_LINKS: readonly PublicLink[] = [...PUBLIC_LINKS, { href: "/privacy", label: "Privacy" }];
