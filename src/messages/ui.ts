import type { AppLocale } from "@/lib/locale-shared";

const en = {
  nav: {
    articles: "Articles",
    technology: "Technology",
    ai: "AI",
    cybersecurity: "Cybersecurity",
    guides: "Guides",
    toggleTheme: "Toggle theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    english: "English",
    spanish: "Spanish",
  },
  footer: {
    tagline:
      "Technology, artificial intelligence, and cybersecurity—explained with rigor and plain language.",
    topics: "Topics",
    legal: "Legal",
    newsletter: "Newsletter",
    newsletterBlurb: "Occasional updates—new posts and links we find useful.",
    privacy: "Privacy",
    legalNotice: "Legal notice",
    copyright:
      "Informational content; not a substitute for specialized professional advice.",
  },
  home: {
    heroTitleBefore: "Technology, AI &",
    heroHighlight: "cybersecurity",
    heroSubtitle:
      "Articles and guides to understand the software around us, adopt artificial intelligence with judgment, and harden your security posture—without hype or sensationalism.",
    browseArticles: "Browse articles",
    browseTopics: "Browse topics",
    scroll: "Scroll",
    pillar1Title: "Depth & context",
    pillar1Desc: "What each technical shift means and how it affects you in practice.",
    pillar2Title: "AI & product",
    pillar2Desc: "Models, tools, and habits for using AI with judgment.",
    pillar3Title: "Security first",
    pillar3Desc: "Threats, defense in depth, and habits that reduce real risk.",
    exploreTopics: "Explore by topic",
    exploreSubtitle: "Find content aligned with what you want to learn or ship",
    catTechnology: "Technology",
    catAi: "Artificial intelligence",
    catCyber: "Cybersecurity",
    catGuides: "Guides & tools",
    latestTitle: "Latest articles",
    latestSubtitle: "Fresh takes on technology, AI, and security",
    viewAll: "View all",
    viewAllArticles: "View all articles",
    newsletterTitle: "Newsletter",
    newsletterSubtitle: "New articles, resources, and curated links. No fluff.",
  },
  blog: {
    metaTitle: "Articles",
    metaDescription:
      "All articles on technology, artificial intelligence, and cybersecurity.",
    headingAll: "All articles",
    subtitle:
      "Analysis, guides, and practical notes for builders and the technically curious.",
    emptyCategory: "No posts in this category yet. Publish from Sanity Studio.",
    filterAll: "All",
  },
  post: {
    back: "Back to articles",
    minRead: "min read",
    reportPrompt: "Why are you reporting this comment?",
    reportOk: "Comment reported. We will review it shortly.",
  },
  newsletterInline: {
    title: "Stay in the loop",
    subtitle: "New articles and curated links—no spam.",
  },
  newsletterForm: {
    emailLabel: "Email address",
    placeholder: "you@example.com",
    subscribe: "Subscribe",
    sending: "Sending...",
    subscribedTitle: "You're subscribed",
    subscribedBody: "We'll let you know when we publish new content.",
    unknownError: "Unknown error.",
  },
  userMenu: {
    signIn: "Sign in",
    userMenuAria: "User menu",
    moderation: "Moderation",
    adminBadge: "Admin",
    signOut: "Sign out",
  },
  comments: {
    title: "Comments",
    commentingAs: "Commenting as",
    signOut: "Sign out",
    placeholder: "Write your comment… (max 1000 characters)",
    postComment: "Post comment",
    sending: "Sending...",
    submitted: "Comment submitted. It will appear after review.",
    signInPrompt: "Sign in to leave a comment",
    continueGoogle: "Continue with Google",
    guidelines:
      "By commenting you agree to our guidelines: be respectful, no spam, no offensive language or explicit content.",
    firstComment: "Be the first to comment.",
    report: "Report",
    userFallback: "User",
  },
  legal: {
    metaTitle: "Legal notice",
    metaDescription: "Legal information for the Redshell website.",
    breadcrumb: "Legal notice",
    title: "Legal notice",
    p1: "The site operator provides this website for informational purposes. Unless expressly stated otherwise, the content does not constitute professional, medical, legal, or security advice.",
    p2: "Links to third parties are provided for convenience; we are not responsible for external content. Trademarks and trade names mentioned may belong to their respective owners.",
    p3: "This text is for guidance only; complete it with identifying details, governing law, and contact information for your country and activity.",
  },
  privacy: {
    metaTitle: "Privacy",
    metaDescription: "How Redshell handles your data.",
    breadcrumb: "Privacy",
    title: "Privacy policy",
    p1: "This site may use technical providers (hosting, analytics, advertising, authentication, and CMS) under their own policies. Data you submit through forms (for example, newsletter or comments) will be used only for that purpose.",
    p2: "You may request access, correction, or deletion where applicable law allows, using the contact methods published on the site.",
    p3: "This text is for guidance only; have it reviewed by legal counsel before relying on it in your jurisdiction.",
  },
  common: {
    home: "Home",
  },
  categories: {
    tecnologia: { long: "Technology", short: "Technology", pill: "Technology" },
    "inteligencia-artificial": {
      long: "Artificial intelligence",
      short: "AI",
      pill: "Artificial intelligence",
    },
    ciberseguridad: { long: "Cybersecurity", short: "Cybersecurity", pill: "Cybersecurity" },
    guias: { long: "Guides & tools", short: "Guides", pill: "Guides & tools" },
  },
} as const;

const es = {
  nav: {
    articles: "Artículos",
    technology: "Tecnología",
    ai: "IA",
    cybersecurity: "Ciberseguridad",
    guides: "Guías",
    toggleTheme: "Cambiar tema",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
  },
  footer: {
    tagline:
      "Tecnología, inteligencia artificial y ciberseguridad—con rigor y lenguaje claro.",
    topics: "Temas",
    legal: "Legal",
    newsletter: "Boletín",
    newsletterBlurb: "Actualizaciones puntuales: novedades y enlaces que nos parecen útiles.",
    privacy: "Privacidad",
    legalNotice: "Aviso legal",
    copyright:
      "Contenido informativo; no sustituye el asesoramiento profesional especializado.",
  },
  home: {
    heroTitleBefore: "Tecnología, IA y",
    heroHighlight: "ciberseguridad",
    heroSubtitle:
      "Artículos y guías para entender el software que nos rodea, usar la inteligencia artificial con criterio y reforzar tu postura de seguridad—sin sensacionalismo.",
    browseArticles: "Ver artículos",
    browseTopics: "Ver temas",
    scroll: "Desplazar",
    pillar1Title: "Profundidad y contexto",
    pillar1Desc: "Qué implica cada cambio técnico y cómo te afecta en la práctica.",
    pillar2Title: "IA y producto",
    pillar2Desc: "Modelos, herramientas y hábitos para usar la IA con juicio.",
    pillar3Title: "Seguridad primero",
    pillar3Desc: "Amenazas, defensa en profundidad y hábitos que reducen el riesgo real.",
    exploreTopics: "Explorar por tema",
    exploreSubtitle: "Encuentra contenido alineado con lo que quieres aprender o construir",
    catTechnology: "Tecnología",
    catAi: "Inteligencia artificial",
    catCyber: "Ciberseguridad",
    catGuides: "Guías y herramientas",
    latestTitle: "Últimos artículos",
    latestSubtitle: "Novedades sobre tecnología, IA y seguridad",
    viewAll: "Ver todo",
    viewAllArticles: "Ver todos los artículos",
    newsletterTitle: "Boletín",
    newsletterSubtitle: "Artículos nuevos, recursos y enlaces seleccionados. Sin relleno.",
  },
  blog: {
    metaTitle: "Artículos",
    metaDescription:
      "Todos los artículos sobre tecnología, inteligencia artificial y ciberseguridad.",
    headingAll: "Todos los artículos",
    subtitle:
      "Análisis, guías y notas prácticas para quien construye producto y curiosea lo técnico.",
    emptyCategory:
      "Aún no hay entradas en esta categoría. Publica desde Sanity Studio.",
    filterAll: "Todos",
  },
  post: {
    back: "Volver a artículos",
    minRead: "min de lectura",
    reportPrompt: "¿Por qué denuncias este comentario?",
    reportOk: "Denuncia enviada. La revisaremos pronto.",
  },
  newsletterInline: {
    title: "No te pierdas nada",
    subtitle: "Artículos nuevos y enlaces seleccionados—sin spam.",
  },
  newsletterForm: {
    emailLabel: "Correo electrónico",
    placeholder: "tu@ejemplo.com",
    subscribe: "Suscribirme",
    sending: "Enviando...",
    subscribedTitle: "Estás suscrito",
    subscribedBody: "Te avisaremos cuando publiquemos contenido nuevo.",
    unknownError: "Error desconocido.",
  },
  userMenu: {
    signIn: "Iniciar sesión",
    userMenuAria: "Menú de usuario",
    moderation: "Moderación",
    adminBadge: "Admin",
    signOut: "Cerrar sesión",
  },
  comments: {
    title: "Comentarios",
    commentingAs: "Comentando como",
    signOut: "Cerrar sesión",
    placeholder: "Escribe tu comentario… (máx. 1000 caracteres)",
    postComment: "Publicar comentario",
    sending: "Enviando...",
    submitted: "Comentario enviado. Aparecerá tras revisión.",
    signInPrompt: "Inicia sesión para comentar",
    continueGoogle: "Continuar con Google",
    guidelines:
      "Al comentar aceptas nuestras normas: respeto, sin spam ni lenguaje ofensivo ni contenido explícito.",
    firstComment: "Sé el primero en comentar.",
    report: "Denunciar",
    userFallback: "Usuario",
  },
  legal: {
    metaTitle: "Aviso legal",
    metaDescription: "Información legal del sitio Redshell.",
    breadcrumb: "Aviso legal",
    title: "Aviso legal",
    p1: "El responsable del sitio lo ofrece con fines informativos. Salvo indicación expresa, el contenido no constituye asesoramiento profesional, médico, legal ni de seguridad.",
    p2: "Los enlaces a terceros son una conveniencia; no nos hacemos responsables del contenido externo. Las marcas mencionadas pueden pertenecer a sus titulares.",
    p3: "Este texto es orientativo; complétalo con datos identificativos, ley aplicable y contacto según tu país y actividad.",
  },
  privacy: {
    metaTitle: "Privacidad",
    metaDescription: "Cómo Redshell trata tus datos.",
    breadcrumb: "Privacidad",
    title: "Política de privacidad",
    p1: "Este sitio puede usar proveedores técnicos (alojamiento, analítica, publicidad, autenticación y CMS) según sus políticas. Los datos que envíes por formularios (por ejemplo, boletín o comentarios) se usarán solo para ese fin.",
    p2: "Puedes solicitar acceso, rectificación o supresión cuando la ley lo permita, mediante los datos de contacto publicados en el sitio.",
    p3: "Este texto es orientativo; hazlo revisar por asesoría legal antes de confiar en él en tu jurisdicción.",
  },
  common: {
    home: "Inicio",
  },
  categories: {
    tecnologia: { long: "Tecnología", short: "Tecnología", pill: "Tecnología" },
    "inteligencia-artificial": {
      long: "Inteligencia artificial",
      short: "IA",
      pill: "Inteligencia artificial",
    },
    ciberseguridad: {
      long: "Ciberseguridad",
      short: "Ciberseguridad",
      pill: "Ciberseguridad",
    },
    guias: { long: "Guías y herramientas", short: "Guías", pill: "Guías y herramientas" },
  },
} as const;

export const uiMessages = {
  en,
  es,
} as const;

export type UiMessages = (typeof uiMessages)[AppLocale];

export function categoryLabel(
  locale: AppLocale,
  slug: string | undefined,
  variant: "long" | "short" | "pill"
): string {
  if (!slug) return "";
  const row = uiMessages[locale].categories as Record<
    string,
    { long: string; short: string; pill: string }
  >;
  return row[slug]?.[variant] ?? slug;
}
