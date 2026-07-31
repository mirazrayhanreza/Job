export type PageType = 
  | 'home' 
  | 'about' 
  | 'contact' 
  | 'category' 
  | 'country' 
  | 'job' 
  | 'company' 
  | 'blog' 
  | 'cms';

export interface SeoPageConfig {
  id: string; // unique ID: e.g., 'home', 'job_j1', 'company_c1', 'blog_b1'
  pageType: PageType;
  targetId?: string; // specific job ID, company ID, etc.
  targetName: string; // human readable name (e.g. "Software Engineer" or "Home Page")
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  slug: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  imageAltText?: string;
  canonicalUrl: string;
  schemaJson?: string; // Schema.org JSON-LD structured data
  seoScore: number; // 0 to 100
  readabilityScore: number; // 0 to 100
  keywordDensity: { keyword: string; count: number; percent: number }[];
  missingTags: string[];
  imageSeoCheck: 'Passed' | 'Warnings' | 'Critical';
  brokenLinkCheck: 'Passed' | 'Failed';
  updatedAt: string;
  improvedTitle?: string; // Optimized Title
  improvedDescription?: string; // Improved content description/Job description
  faqList?: { question: string; answer: string }[]; // FAQ Generation
  internalLinks?: { anchorText: string; url: string; reason: string }[]; // Internal linking suggestions
}

export interface GlobalSeoSettings {
  sitemapXml: string;
  sitemapHtml: string;
  robotsTxt: string;
  googleVerificationCode: string;
  bingVerificationCode: string;
  isSitemapPinged: boolean;
  lastSitemapPing?: string;
  searchEngineIndexingEnabled: boolean;
}
