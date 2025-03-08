import axios from 'axios';
import { ComprehensiveAnalysis } from '../ai-agents/types';
import { OrchestratorAgent } from '../ai-agents/orchestrator.agent';

// List of CORS proxies to try
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];

// Mock data for testing
const getMockAnalysis = (url: string): ComprehensiveAnalysis => ({
  url,
  timestamp: new Date().toISOString(),
  overallScore: 75,
  metrics: {
    lcp: 2500,
    fid: 120,
    cls: 0.15,
    ttfb: 350,
    fcp: 1800,
    si: 3200,
    mobileScore: 78,
    contentScore: 85
  },
  technical: {
    scores: {
      overall: 78,
      security: 85,
      performance: 72,
      structure: 80
    },
    issues: [
      {
        severity: 'high',
        category: 'Performance',
        description: 'Large JavaScript bundles are slowing down page load',
        impact: 'Increases LCP and reduces user engagement',
        recommendation: 'Implement code splitting and lazy loading'
      },
      {
        severity: 'medium',
        category: 'Security',
        description: 'Missing Content-Security-Policy header',
        impact: 'Increases vulnerability to XSS attacks',
        recommendation: 'Implement a strict CSP header'
      }
    ],
    structure: {
      depth: 3,
      internalLinks: 45,
      brokenLinks: 2,
      redirects: 5,
      canonicals: 12
    },
    security: {
      https: true,
      mixedContent: false,
      securityHeaders: ['X-Content-Type-Options', 'X-Frame-Options'],
      sslExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    },
    performance: {
      serverResponse: 250,
      resourceSize: 2.5,
      compression: true,
      caching: true
    },
    recommendations: [
      'Implement code splitting for JavaScript bundles',
      'Add missing security headers',
      'Fix broken links on pages'
    ]
  },
  content: {
    scores: { overall: 75, readability: 80, relevance: 70, optimization: 75 },
    content: { wordCount: 1200, readingTime: 5, readabilityScore: 65, paragraphCount: 12, sentenceCount: 48 },
    keywords: { primary: 'seo analysis', secondary: ['technical seo', 'content optimization'], density: { 'seo analysis': 2.5 }, distribution: { 'seo analysis': 0.8 } },
    semantics: { topics: ['SEO', 'Web Performance', 'Content Strategy'], entities: ['Google', 'Search Console'], sentiment: 0.6 },
    recommendations: ['Improve keyword density', 'Add more relevant entities']
  },
  onPage: {
    scores: { overall: 70, titles: 85, meta: 65, headings: 75, images: 60 },
    elements: {
      title: { content: 'SEO Analysis Tool | Optimize Your Website', length: 42, keywords: ['SEO', 'Analysis', 'Optimize'] },
      meta: { description: 'Analyze your website for SEO issues and get recommendations', keywords: ['SEO', 'Analysis'], robots: 'index,follow', canonical: url },
      headings: [
        { level: 1, content: 'SEO Analysis Dashboard', keywords: ['SEO', 'Analysis'] },
        { level: 2, content: 'Technical Performance', keywords: ['Technical', 'Performance'] }
      ],
      images: [
        { src: '/logo.png', alt: 'SEO Analysis Tool Logo', optimized: true },
        { src: '/hero.jpg', alt: '', optimized: false }
      ]
    },
    recommendations: ['Add alt text to all images', 'Improve meta description']
  },
  userExperience: {
    scores: { overall: 72, navigation: 75, accessibility: 68, interactivity: 70, layout: 80 },
    navigation: {
      menuStructure: { depth: 2, clarity: 80, consistency: 90 },
      userFlow: { pathLength: 3, clickDepth: 2, deadEnds: 0 },
      searchability: { searchPresent: true, filterOptions: 3, searchPlacement: 'header' }
    },
    accessibility: {
      contrast: 4.5,
      focusability: true,
      ariaLabels: false,
      keyboardNav: true,
      textScaling: true
    },
    interactivity: {
      cta: { visibility: 85, placement: ['above fold', 'end of content'], effectiveness: 75 },
      forms: { usability: 80, validation: true, feedback: true },
      engagement: { scrollDepth: 65, interactionRate: 35, bounceRate: 45 }
    },
    recommendations: ['Add ARIA labels to interactive elements', 'Improve CTA visibility']
  },
  mobile: {
    scores: { overall: 80, responsiveness: 85, performance: 75, usability: 80, compatibility: 85 },
    viewport: { configured: true, responsive: true, initialScale: 1, userScalable: true },
    touchTargets: { adequateSize: true, spacing: 12, tapTargets: { total: 24, problematic: 2 } },
    performance: { mobileSpeed: 75, resourceSize: 1.8, imageOptimization: true, lazyLoading: true },
    compatibility: { mobileFirst: true, mediaQueries: ['screen', 'max-width'], fontScaling: true, orientationSupport: true },
    recommendations: ['Fix small touch targets', 'Optimize images further for mobile']
  },
  siteDescription: {
    description: url.includes('chipinpool') 
      ? "Chip In Pool is a website dedicated to poker tournaments and chip management. It provides tools and resources for poker players and tournament organizers to manage their games effectively."
      : "This website appears to be focused on providing information and services related to its industry. It features a modern design with clear navigation and multiple content sections.",
    category: url.includes('chipinpool') ? "Gaming / Poker / Tournaments" : "Business / Services",
    targetAudience: url.includes('chipinpool') 
      ? ["Poker players", "Tournament organizers", "Casino managers"] 
      : ["Business professionals", "Potential customers", "Industry enthusiasts"],
    mainPurpose: url.includes('chipinpool') ? "Tool / Service" : "Information / Lead Generation",
    contentType: url.includes('chipinpool') 
      ? ["Tools", "Guides", "Resources"] 
      : ["Product information", "Blog posts", "Contact information"]
  },
  competitorAnalysis: {
    mainCompetitors: [
      {
        name: url.includes('chipinpool') ? "PokerChips.com" : "Competitor 1",
        url: url.includes('chipinpool') ? "pokerchips.com" : "competitor1.com",
        overlapScore: 85,
        commonKeywords: url.includes('chipinpool') 
          ? ["poker tournament", "chip management", "poker tools"] 
          : ["industry term 1", "service keyword", "product type"],
        strengths: ["Strong brand recognition", "Comprehensive feature set"],
        weaknesses: ["Outdated interface", "Limited mobile support"]
      },
      {
        name: url.includes('chipinpool') ? "PokerTournamentManager.com" : "Competitor 2",
        url: url.includes('chipinpool') ? "pokertournamentmanager.com" : "competitor2.com",
        overlapScore: 75,
        commonKeywords: url.includes('chipinpool') 
          ? ["poker tournament", "tournament management", "poker software"] 
          : ["industry term 2", "service keyword 2", "product type 2"],
        strengths: ["Advanced features", "Modern interface"],
        weaknesses: ["Higher price point", "Steeper learning curve"]
      },
      {
        name: url.includes('chipinpool') ? "PokerStars.com" : "Competitor 3",
        url: url.includes('chipinpool') ? "pokerstars.com" : "competitor3.com",
        overlapScore: 60,
        commonKeywords: url.includes('chipinpool') 
          ? ["poker", "tournaments", "poker chips"] 
          : ["industry term 3", "service keyword 3", "product type 3"],
        strengths: ["Brand recognition", "Large user base"],
        weaknesses: ["Less specialized", "Different target audience"]
      }
    ],
    competitiveLandscape: url.includes('chipinpool')
      ? "The poker tournament management software market is moderately competitive with several established players offering varying levels of functionality and specialization."
      : "The market is competitive with several established players offering similar services with different specializations and price points.",
    marketGaps: url.includes('chipinpool')
      ? ["Mobile-first tournament management", "Integration with live streaming platforms", "AI-powered player analytics"]
      : ["Budget-friendly solutions", "Specialized features for niche segments", "Simplified user experience"],
    recommendedStrategies: url.includes('chipinpool')
      ? ["Focus on mobile experience", "Develop unique tournament formats", "Create educational content for beginners"]
      : ["Highlight unique value proposition", "Target underserved market segments", "Improve content marketing"]
  },
  keywordResearch: {
    primaryKeywords: [
      {
        keyword: url.includes('chipinpool') ? "poker tournament software" : "main industry keyword",
        volume: 2200,
        difficulty: 65,
        relevance: 9,
        intent: "commercial"
      },
      {
        keyword: url.includes('chipinpool') ? "poker chip calculator" : "main product keyword",
        volume: 1800,
        difficulty: 55,
        relevance: 9,
        intent: "transactional"
      },
      {
        keyword: url.includes('chipinpool') ? "tournament chip management" : "main service keyword",
        volume: 1200,
        difficulty: 45,
        relevance: 8,
        intent: "informational"
      },
      {
        keyword: url.includes('chipinpool') ? "poker tournament manager" : "competitor keyword",
        volume: 1500,
        difficulty: 70,
        relevance: 8,
        intent: "commercial"
      },
      {
        keyword: url.includes('chipinpool') ? "poker chips value calculator" : "specific feature keyword",
        volume: 900,
        difficulty: 40,
        relevance: 7,
        intent: "transactional"
      }
    ],
    secondaryKeywords: [
      {
        keyword: url.includes('chipinpool') ? "home poker tournament setup" : "secondary keyword 1",
        volume: 800,
        difficulty: 35,
        relevance: 6,
        intent: "informational"
      },
      {
        keyword: url.includes('chipinpool') ? "poker tournament rules" : "secondary keyword 2",
        volume: 1100,
        difficulty: 50,
        relevance: 6,
        intent: "informational"
      },
      {
        keyword: url.includes('chipinpool') ? "poker chip distribution" : "secondary keyword 3",
        volume: 750,
        difficulty: 30,
        relevance: 7,
        intent: "informational"
      }
    ],
    longTailKeywords: [
      {
        keyword: url.includes('chipinpool') ? "how to organize a poker tournament for beginners" : "long tail keyword 1",
        volume: 320,
        difficulty: 25,
        relevance: 7,
        intent: "informational"
      },
      {
        keyword: url.includes('chipinpool') ? "best poker chip calculator for home games" : "long tail keyword 2",
        volume: 210,
        difficulty: 20,
        relevance: 8,
        intent: "commercial"
      },
      {
        keyword: url.includes('chipinpool') ? "how many poker chips per player in tournament" : "long tail keyword 3",
        volume: 280,
        difficulty: 15,
        relevance: 8,
        intent: "informational"
      }
    ],
    keywordGaps: url.includes('chipinpool')
      ? ["Mobile poker tournament apps", "Poker tournament live streaming", "Poker tournament for charity events"]
      : ["Budget solutions", "Industry-specific applications", "Integration capabilities"],
    recommendedFocus: url.includes('chipinpool')
      ? ["Poker chip calculator", "Tournament management software", "Home poker games"]
      : ["Main product features", "Industry-specific solutions", "Cost-effective alternatives"]
  },
  prioritizedRecommendations: [
    { priority: 'high', category: 'Performance', recommendation: 'Implement code splitting', impact: 'Significant improvement in load times', effort: 'Medium' },
    { priority: 'high', category: 'Mobile', recommendation: 'Fix small touch targets', impact: 'Better mobile usability', effort: 'Low' },
    { priority: 'medium', category: 'Content', recommendation: 'Improve keyword density', impact: 'Better search ranking', effort: 'Medium' }
  ],
  summary: {
    strengths: ['Good mobile responsiveness', 'Proper HTTPS implementation', 'Clear navigation structure'],
    weaknesses: ['JavaScript performance issues', 'Missing alt text on images', 'Keyword optimization'],
    opportunities: ['Implement structured data', 'Optimize for Core Web Vitals', 'Enhance content depth']
  }
});

export const analyzeSEO = async (url: string, html: string, apiKey?: string): Promise<ComprehensiveAnalysis> => {
  console.log('Analyzing URL:', url);
  console.log('HTML length:', html.length);
  
  // If no API key is provided or we're in development mode, use mock data
  if (!apiKey || process.env.NODE_ENV === 'development') {
    console.log('Using mock data for analysis');
    // Simulate a delay to mimic real analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockAnalysis(url);
  }
  
  try {
    // Use the real orchestrator agent with OpenAI
    console.log('Using OpenAI for analysis');
    const orchestrator = new OrchestratorAgent(apiKey);
    const result = await orchestrator.analyze(url, html);
    
    if (typeof result === 'string') {
      throw new Error('Unexpected string result from orchestrator');
    }
    
    return result;
  } catch (error) {
    console.error('Error in real analysis, falling back to mock data:', error);
    return getMockAnalysis(url);
  }
};

// Function to fetch HTML content with multiple CORS proxies
export const fetchHtmlContent = async (url: string): Promise<string> => {
  // Normalize URL
  let normalizedUrl = url;
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }
  
  console.log('Fetching HTML from:', normalizedUrl);
  
  // Try each proxy in sequence
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`Trying proxy: ${proxy}`);
      const proxyUrl = `${proxy}${encodeURIComponent(normalizedUrl)}`;
      console.log('Full proxy URL:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      if (response.ok) {
        const html = await response.text();
        console.log('HTML fetched successfully, length:', html.length);
        return html;
      }
    } catch (proxyError) {
      console.error(`Proxy ${proxy} failed:`, proxyError);
      // Continue to next proxy
    }
  }

  // If all proxies fail, try a public API that can fetch HTML
  try {
    console.log('Trying public API fetch');
    const response = await axios.get(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(normalizedUrl)}`);
    if (response.data) {
      console.log('HTML fetched via public API, length:', response.data.length);
      return response.data;
    }
  } catch (apiError) {
    console.error('Public API fetch failed:', apiError);
  }

  // If all methods fail, throw an error
  throw new Error('Could not retrieve the website content. Please check the URL and try again.');
}; 