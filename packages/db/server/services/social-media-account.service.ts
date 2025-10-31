
/**
 * Social Media Account Service
 *
 * Handles CRUD operations for social media accounts, OAuth token management,
 * and platform-specific API integrations.
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { eq, and, desc } from 'drizzle-orm'
import type { SocialMediaAccount } from '#layers/BaseDB/db/socialMedia/socialMedia'
import { socialMediaAccounts } from '#layers/BaseDB/db/socialMedia/socialMedia'
import { account } from '#layers/BaseDB/db/auth/auth'
import { useDrizzle } from '#layers/BaseDB/server/utils/drizzle'

export type SocialMediaPlatform = 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'google_my_business'

export interface CreateSocialMediaAccountData {
  userId: string
  businessId: string
  platform: SocialMediaPlatform
  accountId: string
  accountName: string
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
}

export interface UpdateSocialMediaAccountData {
  accountName?: string
  accessToken?: string
  refreshToken?: string
  tokenExpiresAt?: Date
  isActive?: boolean
  lastSyncAt?: Date
}

export interface TokenRefreshData {
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
}

export interface SocialMediaAccountFilters {
  userId?: string
  businessId?: string
  platform?: SocialMediaPlatform
  isActive?: boolean
}

/**
 * Social Media Account Service Class
 */
export class SocialMediaAccountService {
  private db = useDrizzle()

  /**
   * Create a new social media account
   */
  async createAccount(data: CreateSocialMediaAccountData): Promise<SocialMediaAccount> {
    const accountData = {
      id: crypto.randomUUID(),
      ...data,
      tokenExpiresAt: data.tokenExpiresAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await this.db
      .insert(socialMediaAccounts)
      .values(accountData)
      .returning()

    const [account] = result

    if (!account) {
      throw new Error('Failed to create social media account')
    }


    return account
  }

  /**
   * Get social media account by ID
   */
  async getAccountById(id: string): Promise<SocialMediaAccount | null> {
    const [account] = await this.db
      .select()
      .from(socialMediaAccounts)
      .where(eq(socialMediaAccounts.id, id))
      .limit(1)

    return account || null
  }

  /**
   * Get social media accounts with filters
   */
  async getAccounts(filters: SocialMediaAccountFilters = {}): Promise<SocialMediaAccount[]> {
    const conditions = []

    if (filters.userId) {
      conditions.push(eq(socialMediaAccounts.userId, filters.userId))
    }

    if (filters.businessId) {
      conditions.push(eq(socialMediaAccounts.businessId, filters.businessId))
    }

    if (filters.platform) {
      conditions.push(eq(socialMediaAccounts.platform, filters.platform))
    }

    if (filters.isActive !== undefined) {
      conditions.push(eq(socialMediaAccounts.isActive, filters.isActive))
    }

    const baseQuery = this.db.select().from(socialMediaAccounts)

    if (conditions.length > 0) {
      return await baseQuery
        .where(and(...conditions))
        .orderBy(desc(socialMediaAccounts.createdAt))
    }

    return await baseQuery.orderBy(desc(socialMediaAccounts.createdAt))
  }

  /**
   * Get accounts by user ID
   */
  async getAccountsByUserId(userId: string): Promise<SocialMediaAccount[]> {
    return this.getAccounts({ userId, isActive: true })
  }

  /**
   * Get accounts by business ID
   */
  async getAccountsByBusinessId(businessId: string): Promise<SocialMediaAccount[]> {
    return this.getAccounts({ businessId, isActive: true })
  }

  /**
   * Get accounts by platform
   */
  async getAccountsForPlatform(platform: string, userId: string) {

    const userAccount = await this.db.select()
      .from(account)
      .where(eq(account.userId, userId))
      .all();


    return userAccount.find(account => account.providerId === platform);
  }

  /**
   * Get account by platform and account ID (for uniqueness check)
   */
  async getAccountByPlatformAndAccountId(
    userId: string,
    platform: SocialMediaPlatform,
    accountId: string
  ): Promise<SocialMediaAccount | null> {
    const [account] = await this.db
      .select()
      .from(socialMediaAccounts)
      .where(
        and(
          eq(socialMediaAccounts.userId, userId),
          eq(socialMediaAccounts.platform, platform),
          eq(socialMediaAccounts.accountId, accountId)
        )
      )
      .limit(1)

    return account || null
  }

  /**
   * Update social media account
   */
  async updateAccount(id: string, data: UpdateSocialMediaAccountData): Promise<SocialMediaAccount | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const [account] = await this.db
      .update(socialMediaAccounts)
      .set(updateData)
      .where(eq(socialMediaAccounts.id, id))
      .returning()

    return account || null
  }

  /**
   * Refresh OAuth tokens for an account
   */
  async refreshTokens(id: string, tokenData: TokenRefreshData): Promise<SocialMediaAccount | null> {
    return this.updateAccount(id, {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tokenExpiresAt: tokenData.tokenExpiresAt,
      lastSyncAt: new Date(),
    })
  }

  /**
   * Deactivate social media account (soft delete)
   */
  async deactivateAccount(id: string): Promise<SocialMediaAccount | null> {
    return this.updateAccount(id, { isActive: false })
  }

  /**
   * Delete social media account (hard delete)
   */
  async deleteAccount(id: string): Promise<boolean> {
    try {
      await this.db
        .delete(socialMediaAccounts)
        .where(eq(socialMediaAccounts.id, id))

      return true
    } catch (error) {
      console.error('Error deleting social media account:', error)
      return false
    }
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  isTokenExpired(account: SocialMediaAccount): boolean {
    if (!account.tokenExpiresAt) return false

    const expirationTime = typeof account.tokenExpiresAt === 'number'
      ? account.tokenExpiresAt * 1000
      : account.tokenExpiresAt.getTime()

    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000)
    return expirationTime <= fiveMinutesFromNow
  }

  /**
   * Get accounts that need token refresh
   */
  async getAccountsNeedingRefresh(): Promise<SocialMediaAccount[]> {
    const accounts = await this.getAccounts({ isActive: true })
    return accounts.filter(account => this.isTokenExpired(account))
  }

  /**
   * Validate account connection by checking token validity
   */
  async validateAccountConnection(id: string): Promise<{ isValid: boolean; needsRefresh: boolean }> {
    const account = await this.getAccountById(id)

    if (!account || !account.isActive) {
      return { isValid: false, needsRefresh: false }
    }

    const needsRefresh = this.isTokenExpired(account)

    // For now, we'll assume the account is valid if it exists and is active
    // In a real implementation, you'd make an API call to verify the token
    return { isValid: true, needsRefresh }
  }

  /**
   * Get platform-specific OAuth scopes
   */
  getPlatformScopes(platform: SocialMediaPlatform): string[] {
    const scopes = {
      facebook: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
      instagram: ['instagram_basic', 'instagram_content_publish'],
      twitter: ['tweet.read', 'tweet.write', 'users.read'],
      tiktok: ['video.list', 'video.upload'],
      google_my_business: ['https://www.googleapis.com/auth/business.manage']
    }

    return scopes[platform] || []
  }

  /**
   * Get platform-specific OAuth URLs
   */
  getPlatformOAuthUrl(platform: SocialMediaPlatform): string {
    const urls = {
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      instagram: 'https://api.instagram.com/oauth/authorize',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      tiktok: 'https://www.tiktok.com/auth/authorize/',
      google_my_business: 'https://accounts.google.com/oauth2/v2/auth'
    }

    return urls[platform] || ''
  }
}

// Export singleton instance
export const socialMediaAccountService = new SocialMediaAccountService()
