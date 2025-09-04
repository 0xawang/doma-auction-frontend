export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DomaAuction",
  description: "Hybrid Dutch Auction Protocol for Domain NFTs",
  navItems: [
    {
      label: "Auctions",
      href: "/auctions",
    },
    {
      label: "Create",
      href: "/create",
    },
    {
      label: "My Auctions",
      href: "/my-auctions",
    },
  ],
  navMenuItems: [
    {
      label: "Auctions",
      href: "/auctions",
    },
    {
      label: "Create Auction",
      href: "/create",
    },
    {
      label: "My Auctions",
      href: "/my-auctions",
    },
  ],
  links: {
    github: "https://github.com/doma-auction",
    twitter: "https://twitter.com/domaauction",
    docs: "https://docs.domaauction.com",
    discord: "https://discord.gg/domaauction",
    sponsor: "https://github.com/sponsors/domaauction",
  },
};
