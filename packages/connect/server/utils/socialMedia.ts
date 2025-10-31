import { auth } from "#layers/BaseAuth/lib/auth"
import type { SocialMediaPlatform } from "#layers/BaseDB/server/services/social-media-account.service"

/**
 * Start OAuth flow by redirecting client to provider's authorization page
 */
export function getAuthUrl(platform: SocialMediaPlatform, callbackUrl?: string) {
  return auth.api.signInSocial({
    body: { provider: platform, callbackURL: callbackUrl }
  })
}

/**
 * Link a social account to the current authenticated user
 */
export function linkAccount(platform: SocialMediaPlatform, callbackUrl?: string) {
  return auth.api.linkSocialAccount({
    body: {
      provider: platform,
      callbackURL: callbackUrl
    },
    headers: {
      'Content-Type': 'application/json'
    }

  })
}

/**
 * Exchange code and retrieve tokens + user info
 * Better Auth handles this internally; you can fetch the linked account info
 */
export async function getAccountInfo(accountId: string) {
  return auth.api.accountInfo({ body: { accountId } })
}

/**
 * Fetch a valid access token for an existing linked account.
 * Automatically refreshes if needed.
 */
export async function getAccessToken(provider: SocialMediaPlatform, accountId?: string) {
  const resp = await auth.api.getAccessToken({
    body: { providerId: provider, accountId }
  })
  return resp.accessToken
}

export interface PlatformUserInfo {
  id: string | undefined
  name: string
  username: string | undefined
  email: string | undefined
  profilePicture: string | undefined
}

/**
 * Fetch user profile from linked account
 */
export async function getUserInfo(provider: SocialMediaPlatform, accountId: string): Promise<PlatformUserInfo> {
  const info = await auth.api.accountInfo({ body: { accountId } })
  return {
    id: info?.user.id,
    name: info?.user.name ?? '',
    username: info?.user?.name ?? undefined,
    email: info?.user?.email ?? undefined,
    profilePicture: info?.user?.image ?? undefined
  }
}
