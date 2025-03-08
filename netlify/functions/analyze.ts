import { Handler } from '@netlify/functions';

// Mock data for testing
const mockAnalysis = (url: string) => ({
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
      securityHeaders: ['X-Content-Type-Options', 'X-Frame-Options']
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

export const handler: Handler = async (event, context) => {
  // Log the request for debugging
  console.log('Received request:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : null
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { url, html } = JSON.parse(event.body || '{}');

    if (!url || !html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL and HTML content are required' }),
      };
    }

    // For now, return mock data instead of using the real OpenAI API
    // This helps with debugging and testing
    const mockResult = mockAnalysis(url);
    
    return {
      statusCode: 200,
      body: JSON.stringify(mockResult),
    };
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to analyze website',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}; 