import { SeoPageConfig, GlobalSeoSettings, PageType } from "../types/seo";
import { Job, Company } from "../mockData";

// Hardcoded initial blogs since they are mapped inside WebPortal.tsx
export interface BlogItem {
  id: string;
  title: string;
  desc: string;
  readTime: string;
}

export const INITIAL_BLOGS: BlogItem[] = [
  {
    id: "blog_1",
    title: "ইউরোপের ওয়ার্ক পারমিট ভিসা পাওয়ার ৫টি সহজ ধাপ",
    desc: "ইউরোপীয় দেশগুলোতে বৈধভাবে কাজের সুযোগ পেতে প্রয়োজনীয় ডকুমেন্টেশন এবং সঠিক আবেদন প্রক্রিয়ার বিস্তারিত গাইডলাইন।",
    readTime: "৫ মিনিট পড়া"
  },
  {
    id: "blog_2",
    title: "বিএমইটি (BMET) ইমিগ্রেশন কার্ড আবেদনের সম্পূর্ণ নিয়ম",
    desc: "ঘরে বসেই সহজে মোবাইল অ্যাপের মাধ্যমে বিএমইটি রেজিস্ট্রেশন এবং স্মার্ট কার্ড ডাউনলোডের ধাপে ধাপে আপডেট প্রক্রিয়া।",
    readTime: "৪ মিনিট পড়া"
  },
  {
    id: "blog_3",
    title: "সিভি (CV) লেখার সঠিক ফরম্যাট যা ইন্টারভিউ কল নিশ্চিত করবে",
    desc: "মধ্যপ্রাচ্য ও ইউরোপের চাকরিদাতাদের উপযোগী একটি আন্তর্জাতিক মানের সিভি বা রিজিউমি তৈরির সেরা টিপস ও ট্রিকস।",
    readTime: "৩ মিনিট পড়া"
  }
];

// Helper to sanitize slug
export function convertToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff-]/g, "") // support English and Bengali chars
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

// Client-side SEO score and keyword density analyzer
export function analyzeSeoMetrics(
  title: string,
  description: string,
  keywords: string[],
  imageAltText?: string
) {
  const missingTags: string[] = [];
  let seoScore = 40;
  let readabilityScore = 50;

  // Title length analysis (optimal: 40-60 chars)
  if (title.length >= 40 && title.length <= 70) {
    seoScore += 20;
    readabilityScore += 15;
  } else if (title.length > 0) {
    seoScore += 10;
    missingTags.push("Title length is suboptimal (ideal: 40-70 characters)");
  } else {
    missingTags.push("Meta Title is completely empty");
  }

  // Description length analysis (optimal: 110-160 chars)
  if (description.length >= 110 && description.length <= 165) {
    seoScore += 20;
    readabilityScore += 25;
  } else if (description.length > 0) {
    seoScore += 10;
    missingTags.push("Meta Description length is suboptimal (ideal: 110-160 characters)");
  } else {
    missingTags.push("Meta Description is empty or too short");
  }

  // Keywords check
  if (keywords.length >= 4) {
    seoScore += 15;
  } else if (keywords.length > 0) {
    seoScore += 5;
    missingTags.push("Add more Meta Keywords (ideal: 5-8 keywords)");
  } else {
    missingTags.push("Meta Keywords are completely missing");
  }

  // Alt Text Check
  let imageSeoCheck: 'Passed' | 'Warnings' | 'Critical' = "Passed";
  if (imageAltText && imageAltText.trim().length > 5) {
    seoScore += 15;
  } else {
    imageSeoCheck = "Warnings";
    missingTags.push("Image ALT text is missing or too short");
  }

  // Canonical presence (always active in our auto generator)
  seoScore += 10;

  // Open Graph/Twitter presence (calculated as passing)
  seoScore += 10;

  // Keyword Density calculation
  const words = (title + " " + description)
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);
  
  const frequency: { [key: string]: number } = {};
  const stopwords = ["এবং", "ও", "হল", "is", "the", "and", "or", "for", "in", "of", "to", "at", "by", "on", "with", "a", "an", "this", "that"];
  
  words.forEach(w => {
    if (w.length > 2 && !stopwords.includes(w)) {
      frequency[w] = (frequency[w] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => {
      const percent = words.length > 0 ? parseFloat(((count / words.length) * 100).toFixed(1)) : 0;
      return { keyword, count, percent };
    });

  // Cap scores at 100
  seoScore = Math.min(100, seoScore);
  readabilityScore = Math.min(100, readabilityScore);

  return {
    seoScore,
    readabilityScore,
    keywordDensity: sortedKeywords,
    missingTags,
    imageSeoCheck,
    brokenLinkCheck: "Passed" as const
  };
}

// Generate default local fallback SEO for any page type
export function generateLocalFallbackSeo(
  pageType: PageType,
  id: string,
  title: string,
  desc: string,
  extra: string = ""
): SeoPageConfig {
  const cleanSlug = convertToSlug(title || id);
  const keywords = [
    title,
    pageType,
    "প্রবাস জবস",
    "Probashi Jobs",
    "Overseas Jobs Bangladesh",
    "বৈদেশিক কর্মসংস্থান",
    "ভিসা প্রসেসিং"
  ].filter(Boolean);

  const seoTitle = `${title} | Probashi Jobs Pro`;
  const metaDescription = desc.length > 150 ? desc.substring(0, 155) + "..." : `${desc} - Overseas Job Opportunities and complete visa assistance for Bangladeshis.`;
  const canonicalUrl = `/${pageType === 'home' ? '' : pageType + '/'}${cleanSlug}`;

  // Build JSON-LD Schema
  let schemaObj: any = {
    "@context": "https://schema.org"
  };

  if (pageType === "job") {
    schemaObj["@type"] = "JobPosting";
    schemaObj["title"] = title;
    schemaObj["description"] = desc;
    schemaObj["datePosted"] = "2026-07-08";
    schemaObj["validThrough"] = "2026-12-31";
    schemaObj["hiringOrganization"] = {
      "@type": "Organization",
      "name": extra || "Approved Employer",
      "sameAs": "https://probashijobs.gov.bd"
    };
  } else if (pageType === "company") {
    schemaObj["@type"] = "Organization";
    schemaObj["name"] = title;
    schemaObj["description"] = desc;
    schemaObj["url"] = `https://probashijobs.gov.bd/company/${cleanSlug}`;
    schemaObj["logo"] = "👑";
  } else if (pageType === "blog") {
    schemaObj["@type"] = "BlogPosting";
    schemaObj["headline"] = title;
    schemaObj["description"] = desc;
    schemaObj["author"] = {
      "@type": "Person",
      "name": "Probashi Jobs Admin"
    };
    schemaObj["publisher"] = {
      "@type": "Organization",
      "name": "Probashi Jobs Pro"
    };
  } else {
    schemaObj["@type"] = "WebPage";
    schemaObj["name"] = title;
    schemaObj["description"] = desc;
  }

  const metrics = analyzeSeoMetrics(seoTitle, metaDescription, keywords, `${title} banner image`);

  // Default Content Optimizations based on page type
  const improvedTitle = `${title} - প্রবাসী ক্যারিয়ার ও বিশ্বস্ত নিয়োগ সার্কুলার`;
  const improvedDescription = `✅ প্রবাস জবস প্রো ভেরিফাইড সার্কুলার: ${desc.length > 200 ? desc.substring(0, 200) + '...' : desc}\n\nপ্রয়োজনীয় যোগ্যতা ও ভিসা প্রসেসিং গাইডলাইন দেখতে সম্পূর্ণ বিবরণ পড়ুন।`;

  const faqList = pageType === "job" 
    ? [
        { 
          question: "এই চাকরির আবেদন প্রক্রিয়া কি?", 
          answer: "প্রবাস জবস প্রো পোর্টালে আপনার সিভি জমা দিন অথবা এজেন্সির দেওয়া নম্বরে সরাসরি যোগাযোগ করুন।" 
        },
        { 
          question: "চাকরির এজেন্সিটি কি বিশ্বস্ত?", 
          answer: "হ্যাঁ, আমরা শুধুমাত্র বিএমইটি (BMET) লাইসেন্সড এবং রিক্রুটিং এজেন্সির বৈধ সার্কুলারগুলোই প্রকাশ করি।" 
        }
      ]
    : [
        { 
          question: "প্রবাস জবস প্রো কি ধরনের সেবা দেয়?", 
          answer: "বাংলাদেশিদের জন্য সরকারি-বেসরকারি বৈদেশিক নিয়োগ বিজ্ঞপ্তি, বিএমইটি স্মার্ট কার্ড ট্র্যাকিং এবং মেডিকেল স্ট্যাটাস ভেরিফিকেশন সেবা দিয়ে থাকে।" 
        },
        { 
          question: "বিদেশ যাওয়ার সময় প্রতারণা এড়ানোর উপায় কি?", 
          answer: "যেকোনো টাকা লেনদেনের পূর্বে এজেন্সির বিএমইটি লাইসেন্স নম্বর যাচাই করুন এবং আমাদের 'প্রতারক চিনে রাখুন' পেজে সতর্কবার্তা দেখে নিন।" 
        }
      ];

  const internalLinks = [
    { 
      anchorText: "হোম পেজ", 
      url: "/", 
      reason: "প্রধান ড্যাশবোর্ডে ফিরে যেতে ইন্টারনাল লিংক" 
    },
    { 
      anchorText: "দেশ অনুযায়ী প্রবাস চাকরি", 
      url: "/country/all", 
      reason: "বিভিন্ন দেশের বৈধ চাকরির তালিকা" 
    }
  ];

  return {
    id,
    pageType,
    targetId: id.includes("_") ? id.split("_")[1] : undefined,
    targetName: title,
    seoTitle,
    metaDescription,
    metaKeywords: keywords,
    slug: cleanSlug,
    ogTitle: seoTitle,
    ogDescription: metaDescription,
    twitterCard: "summary_large_image",
    imageAltText: `Representative image for ${title}`,
    canonicalUrl,
    schemaJson: JSON.stringify(schemaObj, null, 2),
    ...metrics,
    improvedTitle,
    improvedDescription,
    faqList,
    internalLinks,
    updatedAt: new Date().toLocaleDateString("bn-BD") + " " + new Date().toLocaleTimeString("bn-BD")
  };
}

// Generate the initial list of SEO Page Configs
export function getInitialSeoConfigs(jobs: Job[], companies: Company[]): SeoPageConfig[] {
  const configs: SeoPageConfig[] = [];

  // 1. Static Pages
  configs.push(
    generateLocalFallbackSeo("home", "home", "হোম পেজ", "প্রবাসে নির্ভরযোগ্য এবং বৈধ কর্মসংস্থানের সবচেয়ে বড় প্ল্যাটফর্ম। বিএমইটি ও পাসপোর্ট ড্যাশবোর্ড সমৃদ্ধ।")
  );
  configs.push(
    generateLocalFallbackSeo("about", "about", "আমাদের সম্পর্কে (About Us)", "আমরা বাংলাদেশিদের জন্য নিরাপদ এবং সম্পূর্ণ আইনি উপায়ে বৈদেশিক চাকরি খোঁজার বিশ্বস্ত মাধ্যম।")
  );
  configs.push(
    generateLocalFallbackSeo("contact", "contact", "যোগাযোগ করুন (Contact Us)", "যেকোনো ধরণের জিজ্ঞাসা, নিয়োগ বিজ্ঞপ্তি প্রকাশ অথবা কারিগরি সহায়তার জন্য আমাদের সাপোর্ট টিমের সাথে কথা বলুন।")
  );

  // 2. Categories & Countries Page Group
  configs.push(
    generateLocalFallbackSeo("category", "category_all", "ক্যাটাগরি সমূহ (All Job Categories)", "আপনার যোগ্যতা অনুযায়ী ড্রাইভিং, আইটি, কনস্ট্রাকশন ও অন্যান্য ক্যাটাগরির প্রবাস চাকরি খুঁজুন।")
  );
  configs.push(
    generateLocalFallbackSeo("country", "country_all", "দেশ অনুযায়ী চাকরি (Jobs by Country)", "ইতালি, সৌদি আরব, কুয়েত, ওমান, মালয়েশিয়া সহ বিশ্বের বিভিন্ন দেশের সরকারি ও বেসরকারি চাকরির খবর।")
  );

  // 3. Dynamic Jobs
  jobs.forEach(job => {
    configs.push(
      generateLocalFallbackSeo("job", `job_${job.id}`, job.title, job.description || job.title, job.companyName)
    );
  });

  // 4. Dynamic Companies
  companies.forEach(company => {
    configs.push(
      generateLocalFallbackSeo("company", `company_${company.id}`, company.name, company.description || company.name)
    );
  });

  // 5. Dynamic Blogs
  INITIAL_BLOGS.forEach(blog => {
    configs.push(
      generateLocalFallbackSeo("blog", `blog_${blog.id}`, blog.title, blog.desc)
    );
  });

  return configs;
}

// Initial Sitemap & Robots.txt Config
export function generateInitialGlobalSeo(configs: SeoPageConfig[]): GlobalSeoSettings {
  const siteUrl = "https://probashijobs.gov.bd";
  
  // 1. XML Sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  configs.forEach(c => {
    xml += `  <url>\n    <loc>${siteUrl}${c.canonicalUrl}</loc>\n    <lastmod>2026-07-08</lastmod>\n    <changefreq>${c.pageType === 'job' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${c.pageType === 'home' ? '1.0' : c.pageType === 'job' ? '0.8' : '0.5'}</priority>\n  </url>\n`;
  });
  xml += `</urlset>`;

  // 2. HTML Sitemap
  let html = `<div class="sitemap-container font-sans p-6 bg-slate-50 rounded-xl border border-slate-200">\n  <h1 class="text-xl font-bold mb-4 text-slate-800">HTML Sitemap - Probashi Jobs Pro</h1>\n  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n`;
  
  const groups: { [key: string]: SeoPageConfig[] } = {};
  configs.forEach(c => {
    if (!groups[c.pageType]) groups[c.pageType] = [];
    groups[c.pageType].push(c);
  });

  Object.entries(groups).forEach(([type, items]) => {
    html += `    <div class="sitemap-group bg-white p-4 rounded-lg shadow-xs border border-slate-100">\n      <h2 class="text-xs font-black uppercase text-blue-600 mb-2">${type} Pages</h2>\n      <ul class="space-y-1 text-xs text-slate-600">\n`;
    items.forEach(it => {
      html += `        <li><a href="${it.canonicalUrl}" class="hover:underline hover:text-blue-500">${it.targetName}</a></li>\n`;
    });
    html += `      </ul>\n    </div>\n`;
  });
  html += `  </div>\n</div>`;

  // 3. Robots.txt
  const robots = `# robots.txt generated by Probashi Jobs Pro AI SEO Manager
User-agent: *
Allow: /
Disallow: /admin
Disallow: /employer/dashboard
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return {
    sitemapXml: xml,
    sitemapHtml: html,
    robotsTxt: robots,
    googleVerificationCode: "google-site-verification=probashi-jobs-pro-verification-key-2026",
    bingVerificationCode: "msvalidate.01=bing-verification-key-probashi-jobs-2026",
    isSitemapPinged: false,
    searchEngineIndexingEnabled: true
  };
}

// Regenerate Sitemap & Robots when configs update
export function updateGlobalSeo(configs: SeoPageConfig[], existing: GlobalSeoSettings): GlobalSeoSettings {
  const siteUrl = "https://probashijobs.gov.bd";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  configs.forEach(c => {
    xml += `  <url>\n    <loc>${siteUrl}${c.canonicalUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${c.pageType === 'job' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${c.pageType === 'home' ? '1.0' : c.pageType === 'job' ? '0.8' : '0.5'}</priority>\n  </url>\n`;
  });
  xml += `</urlset>`;

  let html = `<div class="sitemap-container font-sans p-6 bg-slate-50 rounded-xl border border-slate-200">\n  <h1 class="text-xl font-bold mb-4 text-slate-800">HTML Sitemap - Probashi Jobs Pro</h1>\n  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n`;
  
  const groups: { [key: string]: SeoPageConfig[] } = {};
  configs.forEach(c => {
    if (!groups[c.pageType]) groups[c.pageType] = [];
    groups[c.pageType].push(c);
  });

  Object.entries(groups).forEach(([type, items]) => {
    html += `    <div class="sitemap-group bg-white p-4 rounded-lg shadow-xs border border-slate-100">\n      <h2 class="text-xs font-black uppercase text-blue-600 mb-2">${type} Pages</h2>\n      <ul class="space-y-1 text-xs text-slate-600">\n`;
    items.forEach(it => {
      html += `        <li><a href="${it.canonicalUrl}" class="hover:underline hover:text-blue-500">${it.targetName}</a></li>\n`;
    });
    html += `      </ul>\n    </div>\n`;
  });
  html += `  </div>\n</div>`;

  return {
    ...existing,
    sitemapXml: xml,
    sitemapHtml: html
  };
}

// Request real-time SEO generation from the server's Gemini API route
export async function generateSeoWithGemini(
  pageType: PageType,
  title: string,
  description: string,
  additionalContext: string = ""
): Promise<Partial<SeoPageConfig> | null> {
  try {
    const res = await fetch("/api/seo/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pageType,
        title,
        description,
        additionalContext
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Server responded with status: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn("Could not generate SEO with Gemini API, using local analyzer instead.", err.message);
    throw err;
  }
}
