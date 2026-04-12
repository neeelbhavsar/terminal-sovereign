export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://portfolio.neelbhavsar.dev";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Neel Bhavsar",
    url: baseUrl,
    jobTitle: "Node.js Developer & Backend Architect",
    description:
      "Full-stack Node.js Developer with 4+ years of experience building scalable backend systems, RESTful APIs, and real-time applications.",
    image: `${baseUrl}/avatar.jpg`,
    sameAs: [
      "https://linkedin.com/in/neeelbhavsar",
      "https://github.com/neeelbhavsar",
    ],
    email: "neelbhavsar124@gmail.com",
    worksFor: {
      "@type": "Organization",
      name: "Artoon Solution Pvt Ltd",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    name: "Neel Bhavsar Portfolio",
    description: "Portfolio of Neel Bhavsar, Node.js Developer & Backend Architect",
    creator: {
      "@type": "Person",
      name: "Neel Bhavsar",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
