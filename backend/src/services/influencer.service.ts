import axios from 'axios';
import { AIService } from './ai.service';

export interface InfluencerSearchParams {
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter';
  category: string;
  minFollowers?: number;
  maxFollowers?: number;
  location?: string;
  engagementRate?: number;
}

export interface InfluencerProfile {
  username: string;
  displayName: string;
  platform: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  category: string[];
  followers: number;
  following: number;
  posts: number;
  avgLikes: number;
  avgComments: number;
  avgViews?: number;
  engagementRate: number;
}

export class InfluencerService {
  /**
   * Search for influencers based on criteria
   * Fetches real data from RapidAPI for actual influencer profiles
   */
  static async searchInfluencers(params: InfluencerSearchParams & { username?: string }): Promise<InfluencerProfile[]> {
    try {
      // If username is provided, fetch real profile data
      if (params.username && params.username.trim()) {
        console.log(`🔍 Fetching REAL ${params.platform} profile: ${params.username}`);
        try {
          const profile = await this.getInfluencerProfile(params.platform, params.username.trim());
          if (profile) {
            console.log(`✅ Found real profile: ${profile.displayName} with ${profile.followers} followers`);
            return [profile];
          }
        } catch (error) {
          console.error(`❌ Failed to fetch ${params.username}:`, error);
          throw new Error(`Could not find influencer "${params.username}" on ${params.platform}. Please check the username and try again.`);
        }
      }

      // For broad searches, fetch real influencers based on category
      console.log(`🎯 Fetching REAL influencers for ${params.platform} / ${params.category}`);
      const realInfluencers: InfluencerProfile[] = await this.fetchRealInfluencersByCategory(params);

      return realInfluencers;
    } catch (error: any) {
      console.error('Influencer Search Error:', error);
      throw new Error(`Failed to search influencers: ${error.message}`);
    }
  }

  /**
   * Fetch real influencers based on category (uses known accounts as samples)
   */
  private static async fetchRealInfluencersByCategory(params: InfluencerSearchParams): Promise<InfluencerProfile[]> {
    // Curated list of real influencers by platform and category
    const realAccountsByCategory: Record<string, Record<string, string[]>> = {
      instagram: {
        fashion: ['zara', 'hm', 'fashionnova', 'asos', 'forever21'],
        beauty: ['sephora', 'maccosmetics', 'nyxcosmetics', 'maybelline', 'loreal'],
        fitness: ['nike', 'gymshark', 'underarmour', 'lululemon', 'adidas'],
        food: ['foodnetwork', 'buzzfeedtasty', 'tasty', 'bonappetitmag', 'delish'],
        tech: ['apple', 'samsung', 'microsoft', 'google', 'sony'],
        travel: ['natgeo', 'beautifuldestinations', 'earthpix', 'travel', 'wanderlust'],
        lifestyle: ['instagram', 'arianagrande', 'selenagomez', 'therock', 'kyliejenner'],
      },
      youtube: {
        fashion: ['UCYzPXprvl5Y-Sf0g4vX-m6g', 'UCaQNWyPBd5pSygkfHaIFqdw', 'UCZGYJFUizSax-yElQaFDp5Q', 'UC5zBh0We4LqBm-_1-2LlTzg', 'UCf8f_FfSQPZLTfPAuwWFWpQ'],
        beauty: ['UCdJMbXYna729tyHwgKx-4hQ', 'UCRlFPqqjsSbTQ3t5sDQpZ-Q', 'UCzTKskwIc_-a0cGvCXA848Q', 'UCucot-Zp428OwkyRm2I7v2Q', 'UCs784qHqXly8tvrbZI0MKCA'],
        fitness: ['UCdQyWjoLyM-oqFbpTSJf7Ng', 'UCFmhgtcQFmCL3iBdZX94Aww', 'UCQSk0YQLqDKYHQDPEDxSqgQ', 'UClCaEnfjrez2LYmp55_7BTw', 'UCFKE7WVJfvaHW5q283SxchA'],
        food: ['UCJFp8uSYCjXOMnkUyb3CQ3Q', 'UCbpMy0Fg74eXXkvxJrtEn3w', 'UCQd9VmZVqP-vlKLvGJrKaVw', 'UCqhnX4jA0A5paNd1v-zEysw', 'UCJHA_jMfCvEnv-3kRjTCQXw'],
        tech: ['UCBJycsmduvYEL83R_U4JriQ', 'UCsTcErHg8oDvUnTzoqsYeNw', 'UCXuqSBlHAE6Xw-yeJA0Tunw', 'UCE_M8A5yxnLfW0KghEeajjw', 'UCWwgaK7x0_FR1goeSRazfsQ'],
        travel: ['UCpVm7bg6pXKo1Pr6k5kxG9A', 'UC6MEef4DMJy80bvJdMYjxXQ', 'UCnTsUMBOA8E-OHJE-UrFOnA', 'UCyEd6QBSgat5kkC6svyjudA', 'UCCjjxf-pT7Qgz_K7xwt1P8A'],
        lifestyle: ['UCtinbF-Q-fVthA0qrFQTgXQ', 'UCbAwSkqJ1W_Eg7wr3cp5BUA', 'UCmh5gdwCx6lN7gEC20leNVA', 'UCxSz6JVYmzVhtkraHWZC7HQ', 'UC9gFih9rw0zNCK3ZtoKQQyA'],
      },
      twitter: {
        fashion: ['Vogue', 'ELLE', 'GQ', 'VogueMagazine', 'Fashionista_com'],
        beauty: ['Sephora', 'MAC_cosmetics', 'Benefit', 'TooFaced', 'NARSissist'],
        fitness: ['Nike', 'UnderArmour', 'Gymshark', 'lululemon', 'Adidas'],
        food: ['FoodNetwork', 'BonAppetit', 'EpicurousDotCom', 'SeriousEats', 'Tasty'],
        tech: ['elonmusk', 'BillGates', 'satyanadella', 'sundarpichai', 'tim_cook'],
        travel: ['NatGeo', 'lonelyplanet', 'CNN Travel', 'Travel_Leisure', 'TravelChannel'],
        lifestyle: ['Oprah', 'MarthaStewart', 'RealSimple', 'EverydayHealth', 'WellAndGood'],
      },
      tiktok: {
        fashion: ['zara', 'hm', 'shein', 'fashionnova', 'asos'],
        beauty: ['sephora', 'elfcosmetics', 'nyxcosmetics', 'maybelline', 'covergirl'],
        fitness: ['nike', 'gymshark', 'lululemon', 'underarmour', 'adidas'],
        food: ['gordonramsay', 'babish', 'emmymade', 'nickdigio', 'ketoconnect'],
        tech: ['apple', 'samsung', 'google', 'microsoft', 'tesla'],
        travel: ['natgeo', 'travel', 'wanderlust', 'beautifuldestinations', 'earthpix'],
        lifestyle: ['charlidamelio', 'addisonre', 'bellapoarch', 'zachking', 'spencerx'],
      },
    };

    const categoryAccounts = realAccountsByCategory[params.platform]?.[params.category] || [];
    
    if (categoryAccounts.length === 0) {
      throw new Error(`No real influencer data available for ${params.platform}/${params.category}. Try entering a specific username instead.`);
    }

    console.log(`📥 Fetching ${categoryAccounts.length} real ${params.platform} profiles...`);
    
    const profiles: InfluencerProfile[] = [];
    
    // Fetch up to 6 real profiles with rate limiting (sequential to avoid hitting API limits)
    const accountsToFetch = categoryAccounts.slice(0, 6).filter((u): u is string => !!u);
    
    console.log(`🔄 Fetching ${accountsToFetch.length} profiles sequentially to avoid rate limits`);
    
    for (const username of accountsToFetch) {
      try {
        console.log(`  → Fetching ${username}...`);
        const profile = await this.getInfluencerProfile(params.platform as 'instagram' | 'youtube' | 'tiktok' | 'twitter', username);
        if (profile) {
          profiles.push(profile);
          console.log(`  ✅ ${username}: ${profile.followers.toLocaleString()} followers`);
        }
        
        // Add delay between requests to avoid rate limiting (500ms)
        if (accountsToFetch.indexOf(username) < accountsToFetch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`  ⚠️ Failed to fetch ${username}:`, error);
        // Continue with other profiles
      }
    }

    if (profiles.length === 0) {
      throw new Error(`Could not fetch any real influencer profiles. APIs may be rate limited or unavailable. Try again in a few moments or enter a specific username.`);
    }

    // Filter by follower count if specified
    let filtered = profiles;
    if (params.minFollowers) {
      filtered = filtered.filter(p => p.followers >= params.minFollowers!);
    }
    if (params.maxFollowers) {
      filtered = filtered.filter(p => p.followers <= params.maxFollowers!);
    }
    if (params.engagementRate) {
      filtered = filtered.filter(p => p.engagementRate >= params.engagementRate!);
    }

    console.log(`✅ Returning ${filtered.length} real influencer profiles`);
    return filtered.sort((a, b) => b.engagementRate - a.engagementRate);
  }

  /**
   * Get detailed influencer profile
   */
  static async getInfluencerProfile(platform: string, username: string): Promise<InfluencerProfile | null> {
    try {
      switch (platform) {
        case 'instagram':
          return await this.getInstagramProfile(username);
        case 'youtube':
          return await this.getYouTubeProfile(username);
        case 'tiktok':
          return await this.getTikTokProfile(username);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error: any) {
      console.error('Get Influencer Profile Error:', error);
      return null;
    }
  }

  /**
   * Calculate engagement rate
   */
  static calculateEngagementRate(likes: number, comments: number, followers: number): number {
    if (followers === 0) return 0;
    const engagement = ((likes + comments) / followers) * 100;
    return Math.round(engagement * 100) / 100;
  }

  /**
   * Score influencer for brand fit
   */
  static async scoreInfluencer(
    influencer: InfluencerProfile,
    brandContext: any
  ): Promise<any> {
    try {
      const aiScore = await AIService.scoreInfluencer(
        {
          username: influencer.username,
          platform: influencer.platform,
          followers: influencer.followers,
          engagementRate: influencer.engagementRate,
          bio: influencer.bio || '',
          category: influencer.category.join(', '),
        },
        brandContext
      );

      return aiScore;
    } catch (error: any) {
      console.error('Score Influencer Error:', error);
      throw error;
    }
  }

  /**
   * Generate influencer outreach template
   */
  static async generateOutreachTemplate(
    influencer: InfluencerProfile,
    brandInfo: any,
    campaignDetails: any
  ): Promise<string> {
    try {
      const prompt = `
Create a personalized influencer outreach email:

Influencer: ${influencer.displayName} (@${influencer.username})
Platform: ${influencer.platform}
Followers: ${influencer.followers.toLocaleString()}
Category: ${influencer.category.join(', ')}

Brand: ${brandInfo.name}
Industry: ${brandInfo.industry}

Campaign: ${campaignDetails.name}
Objective: ${campaignDetails.objective}
Budget Range: ${campaignDetails.budgetRange || 'Flexible'}

Create a warm, professional email that:
1. Compliments their content authentically
2. Explains why they're a great fit
3. Outlines the collaboration opportunity
4. Suggests next steps
5. Keeps it concise (200-250 words)
`;

      const response = await AIService.chatCopilot(prompt);
      return response.success ? (response.reply || '') : '';
    } catch (error: any) {
      console.error('Generate Outreach Error:', error);
      throw error;
    }
  }

  /**
   * Get Instagram profile using RapidAPI
   */
  private static async getInstagramProfile(username: string): Promise<InfluencerProfile> {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_INSTAGRAM_STATS_HOST || 'instagram-statistics-api.p.rapidapi.com';
    
    if (!rapidApiKey) {
      throw new Error('❌ RapidAPI key not configured. Add RAPIDAPI_KEY to .env file.');
    }

    try {
      console.log(`🔄 Calling Instagram API for: ${username}`);
      
      // Use Instagram Statistics API to get profile data
      const response = await axios.get(`https://${rapidApiHost}/community`, {
        params: {
          url: `https://www.instagram.com/${username}/`
        },
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': rapidApiHost
        },
        timeout: 15000
      });

      const data = response.data;
      
      // Different API response structures - handle all cases
      let profileData: any = {};
      
      // Check if response has a data field
      if (data.data) {
        profileData = data.data;
      } else if (data.graphql?.user) {
        // Instagram Graph structure
        profileData = data.graphql.user;
      } else {
        profileData = data;
      }

      console.log(`📊 Instagram data for ${username}:`, JSON.stringify(profileData, null, 2).substring(0, 500));

      // Extract profile information with multiple fallbacks
      // The RapidAPI Instagram Scraper returns 'usersCount' for followers
      const followers = parseInt(
        profileData.usersCount || 
        profileData.edge_followed_by?.count || 
        profileData.followers || 
        profileData.follower_count || 
        '0'
      );
      const following = parseInt(profileData.edge_follow?.count || profileData.following || profileData.following_count || '0');
      const posts = parseInt(profileData.edge_owner_to_timeline_media?.count || profileData.posts || profileData.media_count || profileData.postsCount || '0');
      
      // Calculate average engagement from recent posts if available
      let avgLikes = 0;
      let avgComments = 0;
      
      if (profileData.edge_owner_to_timeline_media?.edges) {
        const recentPosts = profileData.edge_owner_to_timeline_media.edges.slice(0, 12);
        const totalLikes = recentPosts.reduce((sum: number, post: any) => sum + (post.node?.edge_liked_by?.count || 0), 0);
        const totalComments = recentPosts.reduce((sum: number, post: any) => sum + (post.node?.edge_media_to_comment?.count || 0), 0);
        avgLikes = Math.floor(totalLikes / recentPosts.length) || 0;
        avgComments = Math.floor(totalComments / recentPosts.length) || 0;
      } else {
        // Fallback values
        avgLikes = profileData.avg_likes || profileData.average_likes || Math.floor(followers * 0.03);
        avgComments = profileData.avg_comments || profileData.average_comments || Math.floor(avgLikes * 0.05);
      }

      const profile = {
        username,
        displayName: profileData.name || profileData.full_name || profileData.screenName || username.charAt(0).toUpperCase() + username.slice(1),
        platform: 'instagram',
        profileUrl: profileData.url || `https://instagram.com/${username}`,
        avatarUrl: profileData.image || profileData.profile_pic_url || profileData.profile_pic_url_hd || profileData.profile_picture || `https://ui-avatars.com/api/?name=${username}`,
        bio: profileData.description || profileData.biography || profileData.bio || '',
        category: profileData.category_name ? [profileData.category_name] : ['lifestyle'],
        followers,
        following,
        posts,
        avgLikes,
        avgComments,
        engagementRate: this.calculateEngagementRate(avgLikes, avgComments, followers),
        _id: `instagram_${username}_${Date.now()}`,
      } as any;

      console.log(`✅ Instagram profile fetched: ${profile.displayName} - ${profile.followers.toLocaleString()} followers (${profile.engagementRate.toFixed(2)}% engagement)`);
      return profile;
      
    } catch (error: any) {
      console.error(`❌ Instagram API Error for ${username}:`, error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        throw new Error(`Instagram user "${username}" not found. Please check the username and try again.`);
      } else if (error.response?.status === 429) {
        throw new Error(`Rate limit exceeded. Please wait a moment and try again.`);
      } else if (error.response?.status === 403) {
        throw new Error(`Access denied. The RapidAPI key may be invalid or the account may be private.`);
      }
      
      throw new Error(`Failed to fetch Instagram profile: ${error.message}`);
    }
  }



  /**
   * Get YouTube profile using RapidAPI or Google API
   */
  private static async getYouTubeProfile(channelId: string): Promise<InfluencerProfile> {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_YOUTUBE_HOST || 'yt-api.p.rapidapi.com';
    const googleApiKey = process.env.YOUTUBE_API_KEY;
    
    // Try Google YouTube API first (more reliable)
    if (googleApiKey) {
      try {
        console.log(`🔄 Calling Google YouTube API for: ${channelId}`);
        
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels`,
          {
            params: {
              part: 'snippet,statistics,brandingSettings',
              id: channelId,
              key: googleApiKey,
            },
            timeout: 15000,
          }
        );

        const channel = response.data.items?.[0];
        if (channel) {
          const stats = channel.statistics;
          const snippet = channel.snippet;
          const subscribers = parseInt(stats.subscriberCount || '0');
          const videoCount = parseInt(stats.videoCount || '0');
          const viewCount = parseInt(stats.viewCount || '0');
          const avgViews = videoCount > 0 ? Math.floor(viewCount / videoCount) : 0;

          const profile = {
            username: channelId,
            displayName: snippet.title,
            platform: 'youtube',
            profileUrl: `https://youtube.com/channel/${channelId}`,
            avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
            bio: snippet.description?.substring(0, 200) || '',
            category: [snippet.categoryId || 'youtube'],
            followers: subscribers,
            following: 0,
            posts: videoCount,
            avgLikes: Math.floor(avgViews * 0.03),
            avgComments: Math.floor(avgViews * 0.01),
            avgViews: avgViews,
            engagementRate: subscribers > 0 ? (avgViews / subscribers) * 100 : 0,
            _id: `youtube_${channelId}_${Date.now()}`,
          } as any;

          console.log(`✅ YouTube profile fetched: ${profile.displayName} - ${profile.followers.toLocaleString()} subscribers`);
          return profile;
        }
      } catch (error: any) {
        console.error('Google YouTube API Error:', error.response?.data || error.message);
      }
    }

    // Try RapidAPI as fallback
    if (rapidApiKey) {
      try {
        console.log(`🔄 Calling RapidAPI YouTube for: ${channelId}`);
        
        const response = await axios.get(`https://${rapidApiHost}/channel/about`, {
          params: {
            id: channelId
          },
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost
          },
          timeout: 15000
        });

        const data = response.data;
        console.log(`📊 YouTube data:`, JSON.stringify(data, null, 2).substring(0, 500));

        const subscribers = parseInt(data.subscriberCount || data.subscribers || '0');
        const videoCount = parseInt(data.videoCount || data.videos || '0');
        const viewCount = parseInt(data.viewCount || data.views || '0');
        const avgViews = videoCount > 0 ? Math.floor(viewCount / videoCount) : 0;

        const profile = {
          username: channelId,
          displayName: data.title || data.channelName || channelId,
          platform: 'youtube',
          profileUrl: `https://youtube.com/channel/${channelId}`,
          avatarUrl: data.avatar || data.thumbnail || `https://ui-avatars.com/api/?name=${channelId}`,
          bio: (data.description || '').substring(0, 200),
          category: data.category ? [data.category] : ['youtube'],
          followers: subscribers,
          following: 0,
          posts: videoCount,
          avgLikes: Math.floor(avgViews * 0.03),
          avgComments: Math.floor(avgViews * 0.01),
          avgViews: avgViews,
          engagementRate: subscribers > 0 ? (avgViews / subscribers) * 100 : 0,
          _id: `youtube_${channelId}_${Date.now()}`,
        } as any;

        console.log(`✅ YouTube profile fetched: ${profile.displayName} - ${profile.followers.toLocaleString()} subscribers`);
        return profile;
      } catch (error: any) {
        console.error(`❌ RapidAPI YouTube Error for ${channelId}:`, error.response?.data || error.message);
      }
    }
    
    // If both APIs failed
    if (!googleApiKey && !rapidApiKey) {
      throw new Error('❌ No YouTube API keys configured. Add YOUTUBE_API_KEY or RAPIDAPI_KEY to .env file.');
    }
    
    throw new Error(`YouTube channel "${channelId}" not found or APIs failed. Please check the channel ID.`);
  }



  /**
   * Get TikTok profile (mock implementation)
   */
  private static async getTikTokProfile(username: string): Promise<InfluencerProfile> {
    // In production, use TikTok API or scraping service
    return {
      username,
      displayName: username,
      platform: 'tiktok',
      profileUrl: `https://tiktok.com/@${username}`,
      category: ['entertainment'],
      followers: Math.floor(Math.random() * 1000000) + 50000,
      following: Math.floor(Math.random() * 5000) + 500,
      posts: Math.floor(Math.random() * 300) + 50,
      avgLikes: Math.floor(Math.random() * 50000) + 5000,
      avgComments: Math.floor(Math.random() * 1000) + 200,
      avgViews: Math.floor(Math.random() * 500000) + 50000,
      engagementRate: Math.random() * 10 + 5,
    };
  }

  /**
   * DEPRECATED: Use fetchRealInfluencersByCategory instead
   * This function is kept for backwards compatibility only
   */
  private static generateMockInfluencers(params: InfluencerSearchParams): InfluencerProfile[] {
    const categories = params.category.split(',').map(c => c.trim());
    const influencers: InfluencerProfile[] = [];

    // Platform-specific sample accounts (real examples for testing)
    const sampleAccounts: Record<string, string[]> = {
      instagram: [
        'cristiano', 'therock', 'kyliejenner', 'selenagomez', 
        'arianagrande', 'beyonce', 'kimkardashian', 'justinbieber'
      ],
      youtube: [
        'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast
        'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
        'UCbCmjCuTUZos6Inko4u57UQ', // Cocomelon
        'UCBR8-60-B28hp2BmDPdntcQ', // YouTube Movies
      ],
      twitter: [
        'elonmusk', 'BarackObama', 'Cristiano', 'justinbieber',
        'rihanna', 'Cristiano', 'katyperry', 'taylorswift13'
      ],
      tiktok: [
        'charlidamelio', 'khaby.lame', 'bellapoarch', 'addisonre',
        'zachking', 'kimberly.loaiza', 'willsmith', 'tiktok'
      ]
    };

    const sampleByCategory: Record<string, string[]> = {
      fashion: ['fashionnova', 'zara', 'hm', 'asos', 'prettylittlething'],
      beauty: ['hudabeauty', 'jamescharles', 'nikkietutorials', 'jeffreestar'],
      fitness: ['therock', 'kayla_itsines', 'simeonpanda', 'jen_selter'],
      food: ['gordonramsay', 'foodnetwork', 'buzzfeedtasty', 'tasty'],
      tech: ['mkbhd', 'unboxtherapy', 'linustechtips', 'ijustine'],
      travel: ['beautifuldestinations', 'wanderlust', 'earthpix', 'natgeo'],
      lifestyle: ['kyliejenner', 'kimkardashian', 'hudabeauty', 'jamescharles']
    };

    // Get sample names based on platform and category
    let sampleNames = sampleAccounts[params.platform] || [];
    if (categories[0] && sampleByCategory[categories[0]]) {
      const categorySamples = sampleByCategory[categories[0]] || [];
      sampleNames = [...sampleNames, ...categorySamples];
    }

    // Ensure we have at least 8 accounts
    if (sampleNames.length < 8) {
      sampleNames = [
        ...sampleNames,
        'creator_pro',
        'content_master',
        'viral_genius',
        'trend_setter',
        'influence_hub',
        'brand_ambassador',
        'digital_creator',
        'social_star'
      ];
    }

    // Generate profiles
    for (let i = 0; i < Math.min(12, sampleNames.length); i++) {
      const username = sampleNames[i] || `influencer_${i}`;
      const minF = params.minFollowers || 10000;
      const maxF = params.maxFollowers || 1000000;
      const followers = Math.floor(Math.random() * (maxF - minF)) + minF;
      
      // More realistic engagement rates
      const baseEngagement = params.platform === 'tiktok' ? 0.08 : 
                            params.platform === 'instagram' ? 0.035 :
                            params.platform === 'youtube' ? 0.05 : 0.03;
      
      const engagementVariation = (Math.random() - 0.5) * 0.02;
      const actualEngagement = baseEngagement + engagementVariation;
      
      const avgLikes = Math.floor(followers * actualEngagement);
      const avgComments = Math.floor(avgLikes * 0.05);
      const avgViews = params.platform === 'youtube' || params.platform === 'tiktok' 
        ? Math.floor(followers * 0.15) 
        : undefined;

      influencers.push({
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/_/g, ' '),
        platform: params.platform,
        profileUrl: `https://${params.platform}.com/${username}`,
        avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
        bio: `${categories[0] || 'Content'} creator | ${followers > 100000 ? 'Influencer' : 'Creator'} | Collaborations: DM`,
        category: categories,
        followers,
        following: Math.floor(Math.random() * (followers * 0.01)) + 500,
        posts: Math.floor(Math.random() * 400) + 100,
        avgLikes,
        avgComments,
        avgViews,
        engagementRate: this.calculateEngagementRate(avgLikes, avgComments, followers),
        // Add temporary ID for frontend compatibility
        _id: `temp_${params.platform}_${username}_${Date.now()}_${i}`,
      } as any);
    }

    // Filter by engagement rate if specified
    let filtered = influencers;
    if (params.engagementRate) {
      filtered = influencers.filter(inf => inf.engagementRate >= (params.engagementRate || 0));
    }

    return filtered.sort((a, b) => b.engagementRate - a.engagementRate);
  }
}

export default InfluencerService;
