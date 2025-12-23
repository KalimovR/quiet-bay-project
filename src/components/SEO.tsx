import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  structuredData?: object;
}

const SITE_NAME = "Quiet Bay — Тихая Бухта";
const SITE_URL = "https://quietbay.ru";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  structuredData,
}: SEOProps) => {
  const fullTitle = title === "Главная" ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  
  // Truncate description to 160 chars
  const truncatedDescription = description.length > 160 
    ? description.substring(0, 157) + "..." 
    : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDescription} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Schema.org structured data templates
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Quiet Bay",
  "alternateName": "Тихая Бухта",
  "url": "https://quietbay.ru",
  "logo": "https://quietbay.ru/logo.png",
  "description": "ИИ-ассистент для эмоциональной поддержки и психологической помощи",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@quietbay.ru"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Quiet Bay — Тихая Бухта",
  "url": "https://quietbay.ru",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://quietbay.ru/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://quietbay.ru${item.url}`
  }))
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Курс медитации",
  "description": "Онлайн-курс медитации: 10 уроков от основ до продвинутых техник",
  "provider": {
    "@type": "Organization",
    "name": "Quiet Bay"
  },
  "offers": {
    "@type": "Offer",
    "price": "249",
    "priceCurrency": "RUB"
  }
};

export default SEO;
