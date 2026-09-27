// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÃO CENTRAL DO SITE
// Edite apenas este arquivo para atualizar links e informações.
// ─────────────────────────────────────────────────────────────

export const siteConfig = {
  brand: {
    name: "Tatiana Meneses",
    taglineKey: "hero.tagline" as const,
  },

  // ── Contato ────────────────────────────────────────────────
  // Substitua pelos dados reais.
  contact: {
    // Perfil do Instagram (URL completa, abre diretamente o perfil)
    instagram: "https://www.instagram.com/tattianameneses/",
    email: "hello.tattianameneses@gmail.com",
  },

  // ── Redes sociais (área "Redes Sociais" e rodapé) ─────────
  // Para adicionar/remover redes, edite esta lista.
  socials: [
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/tattianameneses/", icon: "instagram" as const },
    { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@baptistaspelomundo", icon: "tiktok" as const },
  ],

  // ── Produtos digitais (links de divulgação Hotmart) ───────
  // Substitua as URLs pelos links reais dos produtos na Hotmart.
  digitalProducts: [
    {
      id: "passaporte-livre",
      nameKey: "ebooks.passaporte.name" as const,
      copyKeys: [
        "ebooks.passaporte.p1",
        "ebooks.passaporte.p2",
        "ebooks.passaporte.close",
      ] as const,
      ctaKey: "ebooks.passaporte.cta" as const,
      image: "/images/ebook-passaporte-livre.webp",
      url: "https://go.hotmart.com/U107639341T?dp=1",
    },
    {
      id: "roteiro-mestre",
      nameKey: "ebooks.mestre.name" as const,
      copyKeys: [
        "ebooks.mestre.lead",
        "ebooks.mestre.p1",
        "ebooks.mestre.close",
      ] as const,
      ctaKey: "ebooks.mestre.cta" as const,
      image: "/images/ebook-roteiro-mestre.webp",
      url: "https://go.hotmart.com/L107717592L?dp=1",
    },
  ],

  // ── Imagens ───────────────────────────────────────────────
  aboutPhoto: "/images/tatiana.webp",
  heroImage: "/images/hero-travel.webp",
} as const;
