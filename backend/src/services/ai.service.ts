import OpenAI from 'openai';

// Initialize OpenRouter (compatible with OpenAI SDK)
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.OPENROUTER_SITE_NAME || 'GrowPilot',
  },
});

const AI_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324';

export interface GenerateAdCreativeRequest {
  brandName: string;
  industry: string;
  objective: string;
  targetAudience: string;
  tone?: string;
  platform: string;
  additionalContext?: string;
}

export interface GenerateContentRequest {
  type: 'blog' | 'social_post' | 'ad_copy' | 'email';
  topic: string;
  keywords?: string[];
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  additionalInstructions?: string;
}

export class AIService {
  /**
   * Generate ad creative text (headline, description, CTA)
   */
  static async generateAdCreative(params: GenerateAdCreativeRequest) {
    try {
      const prompt = `
You are an expert digital marketing copywriter. Generate compelling ad creative for:

Brand: ${params.brandName}
Industry: ${params.industry}
Campaign Objective: ${params.objective}
Target Audience: ${params.targetAudience}
Platform: ${params.platform}
Tone: ${params.tone || 'professional and engaging'}
${params.additionalContext ? `Additional Context: ${params.additionalContext}` : ''}

Generate:
1. 3 attention-grabbing headlines (max 60 characters each)
2. 3 compelling descriptions (max 150 characters each)
3. 3 strong call-to-action phrases

Format as JSON with keys: headlines, descriptions, ctas
`;

      const response = await openrouter.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert digital marketing copywriter specializing in high-converting ad copy.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      return {
        success: true,
        data: JSON.parse(content || '{}'),
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error: any) {
      console.error('AI Creative Generation Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate image using DALL-E
   */
  static async generateImage(prompt: string, size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024') {
    try {
      const response = await openrouter.images.generate({
        model: 'dall-e-3',
        prompt: `Professional marketing advertisement: ${prompt}. High quality, modern design, eye-catching.`,
        n: 1,
        size: size,
        quality: 'standard',
      });

      return {
        success: true,
        url: response.data?.[0]?.url || '',
        revisedPrompt: response.data?.[0]?.revised_prompt || prompt,
      };
    } catch (error: any) {
      console.error('AI Image Generation Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate content (blog, social post, etc.)
   */
  static async generateContent(params: GenerateContentRequest) {
    try {
      const lengthMap = {
        short: '200-300 words',
        medium: '500-700 words',
        long: '1000-1500 words',
      };

      const systemMessage = 'You are an expert content writer specializing in marketing and SEO-optimized content.';
      const prompt = `
Create ${params.type.replace('_', ' ')} content:

Topic: ${params.topic}
${params.keywords ? `Keywords to include: ${params.keywords.join(', ')}` : ''}
Tone: ${params.tone || 'professional and engaging'}
Length: ${lengthMap[params.length || 'medium']}
${params.additionalInstructions ? `Additional Instructions: ${params.additionalInstructions}` : ''}

Requirements:
- Make it engaging and valuable to readers
- Include relevant keywords naturally
- Use clear structure with headings if appropriate
- End with a call-to-action
${params.type === 'blog' ? '- Include meta title and meta description for SEO' : ''}
`;

      const response = await openrouter.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;

      return {
        success: true,
        content: content,
        tokensUsed: tokensUsed,
        model: AI_MODEL,
      };
    } catch (error: any) {
      console.error('AI Content Generation Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Analyze and suggest SEO improvements
   */
  static async analyzeSEO(url: string, pageContent: string, currentTitle?: string, currentMeta?: string) {
    try {
      const prompt = `
Analyze this webpage for SEO and provide actionable recommendations:

URL: ${url}
${currentTitle ? `Current Title: ${currentTitle}` : ''}
${currentMeta ? `Current Meta Description: ${currentMeta}` : ''}

Page Content Preview:
${pageContent.substring(0, 2000)}...

Provide:
1. Overall SEO score (0-100)
2. Title tag recommendations
3. Meta description recommendations
4. Key issues found
5. Quick wins for improvement
6. Suggested keywords to target

Format as JSON with keys: score, titleSuggestions, metaSuggestions, issues, quickWins, keywords
`;

      const response = await openrouter.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert who analyzes websites and provides actionable recommendations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      return {
        success: true,
        data: JSON.parse(content || '{}'),
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error: any) {
      console.error('AI SEO Analysis Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Score and rank influencer based on relevance
   */
  static async scoreInfluencer(influencerData: any, brandContext: any) {
    try {
      const prompt = `
Score this influencer for brand collaboration potential:

Influencer:
- Username: ${influencerData.username}
- Platform: ${influencerData.platform}
- Followers: ${influencerData.followers}
- Engagement Rate: ${influencerData.engagementRate}%
- Bio: ${influencerData.bio}
- Category: ${influencerData.category}

Brand Context:
- Name: ${brandContext.name}
- Industry: ${brandContext.industry}
- Target Audience: ${brandContext.targetAudience}

Provide scores (0-100) for:
1. Relevance - how well the influencer matches the brand
2. Authenticity - genuine engagement and credibility
3. Reach - potential audience impact
4. Engagement - quality of audience interaction
5. Overall score

Also suggest collaboration approach and estimated value.

Format as JSON with keys: relevance, authenticity, reach, engagement, overall, collaborationTips, estimatedValue
`;

      const response = await openrouter.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an influencer marketing expert who evaluates collaboration potential.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      return {
        success: true,
        data: JSON.parse(content || '{}'),
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error: any) {
      console.error('AI Influencer Scoring Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate campaign optimization suggestions
   */
  static async optimizeCampaign(campaignData: any) {
    try {
      const prompt = `
Analyze this campaign and suggest optimizations:

Campaign: ${campaignData.name}
Objective: ${campaignData.objective}
Platform: ${campaignData.platform}
Budget: $${campaignData.budget.total}

Performance:
- Impressions: ${campaignData.performance.impressions}
- Clicks: ${campaignData.performance.clicks}
- CTR: ${campaignData.performance.ctr}%
- CPC: $${campaignData.performance.cpc}
- Conversions: ${campaignData.performance.conversions}

Targeting:
${JSON.stringify(campaignData.targeting, null, 2)}

Provide:
1. Performance assessment
2. Top 3 optimization actions
3. Budget reallocation suggestions
4. Targeting refinements
5. Creative recommendations
6. Predicted ROI impact

Format as JSON with keys: assessment, optimizations, budgetSuggestions, targetingChanges, creativeIdeas, predictedImpact
`;

      const response = await openrouter.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a performance marketing expert specializing in campaign optimization.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      return {
        success: true,
        data: JSON.parse(content || '{}'),
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error: any) {
      console.error('AI Campaign Optimization Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Growth Copilot - conversational assistant
   */
  static async chatCopilot(message: string, context?: any) {
    try {
      const systemPrompt = `You are GrowPilot AI, an expert digital marketing assistant. You help users:
- Create and optimize ad campaigns
- Generate content ideas
- Improve SEO
- Find influencers
- Analyze performance data

Be concise, actionable, and friendly. Provide specific recommendations.
${context ? `\n\nUser Context:\n${JSON.stringify(context, null, 2)}` : ''}`;

      const response = await openrouter.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return {
        success: true,
        reply: response.choices[0]?.message?.content || '',
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error: any) {
      console.error('AI Copilot Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default AIService;
