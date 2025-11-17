import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { AIService } from './ai.service';

export interface SEOAuditResult {
  url: string;
  scores: {
    overall: number;
    technical: number;
    content: number;
    mobile: number;
    speed: number;
    accessibility: number;
  };
  technicalSEO: any;
  contentAnalysis: any;
  keywords: any[];
  recommendations: any[];
  aiInsights: any;
}

export class SEOService {
  /**
   * Perform comprehensive SEO audit
   */
  static async auditWebsite(url: string): Promise<SEOAuditResult> {
    try {
      // Validate URL format
      try {
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          throw new Error('URL must use HTTP or HTTPS protocol');
        }
      } catch (e: any) {
        throw new Error('Invalid URL format. Please provide a complete URL including http:// or https://');
      }

      // Fetch page content
      const { html, loadTime } = await this.fetchPageContent(url);
      
      if (!html || html.trim().length === 0) {
        throw new Error('Received empty response from the website. The page may not exist or is not accessible.');
      }
      
      const $ = cheerio.load(html);

      // Technical SEO Analysis
      const technicalSEO = this.analyzeTechnical($, html);
      
      // Content Analysis
      const contentAnalysis = this.analyzeContent($);
      
      // Mobile & Performance
      const mobile = this.analyzeMobile($);
      const performance = {
        loadTime,
        pageSize: Buffer.byteLength(html, 'utf8'),
        requests: $('script, link, img').length,
      };

      // Calculate scores
      const technicalScore = this.calculateTechnicalScore(technicalSEO);
      const contentScore = this.calculateContentScore(contentAnalysis);
      const mobileScore = mobile.responsive && mobile.viewport ? 100 : 50;
      const speedScore = this.calculateSpeedScore(performance);
      const accessibilityScore = this.calculateAccessibilityScore($);

      const overallScore = Math.round(
        (technicalScore * 0.3 + contentScore * 0.25 + mobileScore * 0.2 + speedScore * 0.15 + accessibilityScore * 0.1)
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        technicalSEO,
        contentAnalysis,
        mobile,
        performance
      );

      // Get AI insights (optional - don't fail if AI is unavailable)
      let aiInsights = {};
      try {
        const pageText = $('body').text().substring(0, 3000);
        const aiAnalysis = await AIService.analyzeSEO(
          url,
          pageText,
          $('title').text(),
          $('meta[name="description"]').attr('content')
        );
        aiInsights = aiAnalysis.success ? aiAnalysis.data : {};
      } catch (aiError: any) {
        console.warn('AI insights not available:', aiError.message);
        // Continue without AI insights
      }

      const result: SEOAuditResult = {
        url,
        scores: {
          overall: overallScore,
          technical: technicalScore,
          content: contentScore,
          mobile: mobileScore,
          speed: speedScore,
          accessibility: accessibilityScore,
        },
        technicalSEO: {
          ...technicalSEO,
          mobile,
          performance,
        },
        contentAnalysis,
        keywords: this.extractKeywords($),
        recommendations,
        aiInsights,
      };

      return result;
    } catch (error: any) {
      console.error('SEO Audit Error:', error);
      throw new Error(`Failed to audit website: ${error.message}`);
    }
  }

  /**
   * Fetch page content with load time tracking
   */
  private static async fetchPageContent(url: string): Promise<{ html: string; loadTime: number }> {
    const startTime = Date.now();
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 400, // Accept any status code less than 400
      });
      const loadTime = Date.now() - startTime;
      return {
        html: response.data,
        loadTime,
      };
    } catch (error: any) {
      // Provide user-friendly error messages
      if (error.response) {
        const status = error.response.status;
        if (status === 403) {
          throw new Error('Website blocked the audit request. This website may have anti-bot protection. Try a different URL or ensure the website is publicly accessible.');
        } else if (status === 404) {
          throw new Error('Page not found (404). Please check the URL and try again.');
        } else if (status === 401) {
          throw new Error('Unauthorized (401). This page requires authentication.');
        } else if (status === 503) {
          throw new Error('Service unavailable (503). The website may be down or experiencing issues.');
        } else if (status >= 500) {
          throw new Error(`Server error (${status}). The website is experiencing technical difficulties.`);
        } else {
          throw new Error(`Failed to access website (HTTP ${status}). Please try again.`);
        }
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Website not found. Please check the URL and ensure it includes http:// or https://');
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. The website is taking too long to respond.');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. The website may be down or blocking requests.');
      } else {
        throw new Error(`Failed to fetch page: ${error.message}`);
      }
    }
  }

  /**
   * Analyze technical SEO elements
   */
  private static analyzeTechnical($: cheerio.CheerioAPI, html: string): any {
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';

    const headings = {
      h1Count: $('h1').length,
      h2Count: $('h2').length,
      structure: [] as string[],
    };

    $('h1, h2, h3').each((i, el) => {
      headings.structure.push(`${el.name}: ${$(el).text().substring(0, 60)}`);
    });

    const images = {
      total: $('img').length,
      withAlt: $('img[alt]').length,
      withoutAlt: 0,
      optimized: 0,
    };
    images.withoutAlt = images.total - images.withAlt;

    const links = {
      internal: 0,
      external: 0,
      broken: 0,
    };

    $('a[href]').each((i, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('http')) {
        links.external++;
      } else if (href.startsWith('/') || href.startsWith('#')) {
        links.internal++;
      }
    });

    return {
      metaTags: {
        hasTitle: title.length > 0,
        titleLength: title.length,
        hasDescription: description.length > 0,
        descriptionLength: description.length,
        hasKeywords: keywords.length > 0,
        hasOpenGraph: $('meta[property^="og:"]').length > 0,
      },
      headings,
      images,
      links,
    };
  }

  /**
   * Analyze content quality
   */
  private static analyzeContent($: cheerio.CheerioAPI): any {
    const bodyText = $('body').text();
    const words = bodyText.trim().split(/\s+/);
    const wordCount = words.length;

    // Simple readability score (Flesch Reading Ease approximation)
    const sentences = bodyText.split(/[.!?]+/).length;
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);
    const readability = Math.max(0, Math.min(100, 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length)));

    return {
      wordCount,
      readability: Math.round(readability),
      contentQuality: wordCount > 300 ? 'good' : 'needs_improvement',
      duplicateContent: false, // Would need external API
    };
  }

  /**
   * Analyze mobile friendliness
   */
  private static analyzeMobile($: cheerio.CheerioAPI): any {
    return {
      responsive: $('meta[name="viewport"]').length > 0,
      viewport: $('meta[name="viewport"]').attr('content')?.includes('width=device-width') || false,
    };
  }

  /**
   * Calculate technical SEO score
   */
  private static calculateTechnicalScore(technical: any): number {
    let score = 0;
    const meta = technical.metaTags;

    if (meta.hasTitle) score += 20;
    if (meta.titleLength >= 30 && meta.titleLength <= 60) score += 10;
    if (meta.hasDescription) score += 20;
    if (meta.descriptionLength >= 120 && meta.descriptionLength <= 160) score += 10;
    if (meta.hasOpenGraph) score += 10;
    if (technical.headings.h1Count === 1) score += 15;
    if (technical.headings.h2Count > 0) score += 10;
    if (technical.images.withAlt / technical.images.total > 0.8) score += 5;

    return Math.min(100, score);
  }

  /**
   * Calculate content quality score
   */
  private static calculateContentScore(content: any): number {
    let score = 0;

    if (content.wordCount >= 300) score += 40;
    else if (content.wordCount >= 200) score += 25;
    else score += 10;

    if (content.readability >= 60) score += 30;
    else if (content.readability >= 40) score += 20;
    else score += 10;

    score += 30; // Base content structure score

    return Math.min(100, score);
  }

  /**
   * Calculate speed score
   */
  private static calculateSpeedScore(performance: any): number {
    const { loadTime, pageSize } = performance;
    
    let score = 100;
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 15;
    else if (loadTime > 1000) score -= 5;

    if (pageSize > 3000000) score -= 20; // > 3MB
    else if (pageSize > 1500000) score -= 10; // > 1.5MB

    return Math.max(0, score);
  }

  /**
   * Calculate accessibility score
   */
  private static calculateAccessibilityScore($: cheerio.CheerioAPI): number {
    let score = 100;

    if ($('html[lang]').length === 0) score -= 20;
    if ($('img:not([alt])').length > 0) score -= 15;
    if ($('a:not([href])').length > 0) score -= 10;
    if ($('button:not([aria-label])').length > 3) score -= 10;

    return Math.max(0, score);
  }

  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(
    technical: any,
    content: any,
    mobile: any,
    performance: any
  ): any[] {
    const recommendations: any[] = [];

    // Technical recommendations
    if (!technical.metaTags.hasTitle) {
      recommendations.push({
        category: 'Technical SEO',
        priority: 'critical',
        issue: 'Missing title tag',
        solution: 'Add a unique, descriptive title tag (50-60 characters)',
        impact: 'High - Essential for search rankings',
      });
    }

    if (!technical.metaTags.hasDescription) {
      recommendations.push({
        category: 'Technical SEO',
        priority: 'high',
        issue: 'Missing meta description',
        solution: 'Add a compelling meta description (120-160 characters)',
        impact: 'Medium - Improves click-through rate',
      });
    }

    if (technical.headings.h1Count !== 1) {
      recommendations.push({
        category: 'Technical SEO',
        priority: 'high',
        issue: `${technical.headings.h1Count === 0 ? 'Missing' : 'Multiple'} H1 heading`,
        solution: 'Use exactly one H1 heading per page',
        impact: 'Medium - Important for content structure',
      });
    }

    // Content recommendations
    if (content.wordCount < 300) {
      recommendations.push({
        category: 'Content Quality',
        priority: 'medium',
        issue: 'Thin content',
        solution: 'Expand content to at least 300 words with valuable information',
        impact: 'Medium - More content helps rankings',
      });
    }

    // Mobile recommendations
    if (!mobile.responsive) {
      recommendations.push({
        category: 'Mobile',
        priority: 'critical',
        issue: 'Not mobile-friendly',
        solution: 'Add viewport meta tag and responsive design',
        impact: 'Critical - Mobile-first indexing',
      });
    }

    // Performance recommendations
    if (performance.loadTime > 3000) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        issue: 'Slow page load time',
        solution: 'Optimize images, minify CSS/JS, enable caching',
        impact: 'High - Affects rankings and user experience',
      });
    }

    return recommendations;
  }

  /**
   * Extract potential keywords
   */
  private static extractKeywords($: cheerio.CheerioAPI): any[] {
    const text = $('body').text().toLowerCase();
    const words = text.match(/\b[a-z]{4,}\b/g) || [];
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({
        keyword,
        density: ((count / words.length) * 100).toFixed(2),
      }));
  }

  /**
   * Count syllables in a word (simple approximation)
   */
  private static countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  /**
   * Find keyword opportunities
   */
  static async findKeywords(topic: string, competitors?: string[]): Promise<any[]> {
    // This would integrate with a keyword research API in production
    // For now, returning AI-generated suggestions
    const prompt = `Suggest 10 high-value SEO keywords for: ${topic}. Include search intent and difficulty estimate.`;
    
    // Placeholder implementation
    return [
      { keyword: topic, volume: 1000, difficulty: 50, opportunity: 75 },
    ];
  }
}

export default SEOService;
