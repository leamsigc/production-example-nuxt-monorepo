/**
 * POST /api/v1/posts/format - Format post content for specific platforms
 * 
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { socialMediaAccountService } from '~~/server/services/social-media-account.service'
import type { PostContent } from '~~/server/utils/publishing'

export default defineEventHandler(async (event) => {
  try {
    // Get user from session
    const session = await getUserSession(event)
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get request body
    const body = await readBody(event)
    
    if (!body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content is required for formatting'
      })
    }

    if (!body.platforms && !body.socialAccountIds) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either platforms or socialAccountIds must be provided'
      })
    }

    // Prepare content for formatting
    const content: PostContent = {
      text: body.content,
      mediaUrls: body.mediaUrls || []
    }

    // Formatting options
    const options = {
      truncateText: body.truncateText !== false, // Default to true
      addEllipsis: body.addEllipsis !== false, // Default to true
      preserveHashtags: body.preserveHashtags !== false, // Default to true
      preserveMentions: body.preserveMentions !== false, // Default to true
      optimizeForEngagement: body.optimizeForEngagement !== false // Default to true
    }

    let formattedResults: Record<string, any> = {}

    if (body.platforms) {
      // Format for specific platforms
      const variations = suggestPlatformVariations(content, body.platforms)
      
      for (const platform of body.platforms) {
        const formatted = formatContentForPlatform(platform, content, options)
        formattedResults[platform] = {
          original: content,
          formatted,
          suggested: variations[platform],
          platform
        }
      }
    }

    if (body.socialAccountIds) {
      // Get social accounts and format for their platforms
      const accounts = await Promise.all(
        body.socialAccountIds.map((id: string) => 
          socialMediaAccountService.getAccountById(id)
        )
      )

      const platforms = accounts
        .filter(account => account !== null)
        .map(account => account!.platform)

      const variations = suggestPlatformVariations(content, platforms)

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i]
        if (account) {
          const formatted = formatContentForPlatform(account.platform, content, options)
          formattedResults[body.socialAccountIds[i]] = {
            original: content,
            formatted,
            suggested: variations[account.platform],
            platform: account.platform,
            accountName: account.accountName
          }
        }
      }
    }

    return {
      success: true,
      data: {
        results: formattedResults,
        options: options,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})