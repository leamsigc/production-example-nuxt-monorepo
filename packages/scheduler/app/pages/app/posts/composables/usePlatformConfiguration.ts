
import { useI18n } from 'vue-i18n';
import type { PostCreateBase, Asset } from '#layers/BaseDB/db/schema';
import type { PostCreateBaseExtended } from '../types';

/**
 * Defines platform-specific configurations for social media posts,
 * including restrictions and supported features for various platforms.
 * This composable provides a centralized source of truth for
 * platform capabilities, useful for dynamic UI adjustments and validation.
 */
export interface PlatformConfig {
  maxPostLength: number;
  maxImages: number;
  supportsComments: boolean;
  supportsImagesInComments: boolean;
  supportsCarousel: boolean;
  supportsVideo: boolean;
  maxVideoLengthSeconds?: number;
  supportsLinkPreviews: boolean;
  supportsTags?: boolean;
  supportsCategories?: boolean;
  supportsPrivacySettings?: boolean;
  supportsSounds?: boolean;
  supportsShorts?: boolean;
  supportsStories?: boolean;
}

export interface SocialMediaPlatformConfigurations {
  facebook: PlatformConfig;
  instagram: PlatformConfig;
  twitter: PlatformConfig;
  google: PlatformConfig;
  'email-password': PlatformConfig;
  linkedin: PlatformConfig;
  tiktok: PlatformConfig;
  threads: PlatformConfig;
  youtube: PlatformConfig;
  pinterest: PlatformConfig;
  mastodon: PlatformConfig;
  bluesky: PlatformConfig;
  default: PlatformConfig;
}

export const usePlatformConfiguration = () => {
  const { t } = useI18n();

  const platformConfigurations: SocialMediaPlatformConfigurations = {
    default: {
      maxPostLength: 100000, // Very large default
      maxImages: 10,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 72000, // 20 hours
      supportsLinkPreviews: true,
      supportsTags: true,
      supportsCategories: true,
      supportsPrivacySettings: true,
      supportsSounds: true,
      supportsShorts: true,
      supportsStories: true,
    },
    facebook: {
      maxPostLength: 63206,
      maxImages: 10,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 14400,
      supportsLinkPreviews: true,
      supportsStories: true,
    },
    instagram: {
      maxPostLength: 2200,
      maxImages: 10,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 3600,
      supportsLinkPreviews: false,
      supportsStories: true,
    },
    twitter: {
      maxPostLength: 280,
      maxImages: 4,
      supportsComments: true,
      supportsImagesInComments: false,
      supportsCarousel: false,
      supportsVideo: true,
      maxVideoLengthSeconds: 140,
      supportsLinkPreviews: true,
    },
    google: {
      maxPostLength: 1500,
      maxImages: 1,
      supportsComments: true,
      supportsImagesInComments: false,
      supportsCarousel: false,
      supportsVideo: true,
      maxVideoLengthSeconds: 30,
      supportsLinkPreviews: true,
    },
    'email-password': {
      maxPostLength: 5000,
      maxImages: 5,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 600,
      supportsLinkPreviews: true,
    },
    linkedin: {
      maxPostLength: 3000,
      maxImages: 9,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 600,
      supportsLinkPreviews: true,
    },
    tiktok: {
      maxPostLength: 2200,
      maxImages: 0,
      supportsComments: true,
      supportsImagesInComments: false,
      supportsCarousel: false,
      supportsVideo: true,
      maxVideoLengthSeconds: 180,
      supportsLinkPreviews: true,
      supportsSounds: true,
    },
    threads: {
      maxPostLength: 500,
      maxImages: 10,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 300,
      supportsLinkPreviews: true,
    },
    youtube: {
      maxPostLength: 5000,
      maxImages: 1,
      supportsComments: true,
      supportsImagesInComments: false,
      supportsCarousel: false,
      supportsVideo: true,
      maxVideoLengthSeconds: 72000,
      supportsLinkPreviews: true,
      supportsTags: true,
      supportsCategories: true,
      supportsPrivacySettings: true,
      supportsShorts: true,
    },
    pinterest: {
      maxPostLength: 500,
      maxImages: 1,
      supportsComments: true,
      supportsImagesInComments: false,
      supportsCarousel: true,
      supportsVideo: true,
      maxVideoLengthSeconds: 180,
      supportsLinkPreviews: true,
    },
    mastodon: {
      maxPostLength: 500,
      maxImages: 4,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: false,
      supportsVideo: true,
      maxVideoLengthSeconds: 240,
      supportsLinkPreviews: true,
    },
    bluesky: {
      maxPostLength: 300,
      maxImages: 4,
      supportsComments: true,
      supportsImagesInComments: true,
      supportsCarousel: false,
      supportsVideo: false,
      supportsLinkPreviews: true,
    },
  };

  function validatePostForPlatform(post: PostCreateBaseExtended, postMediaAssets: Asset[], platformType: keyof SocialMediaPlatformConfigurations): { isValid: boolean; message?: string } {
    const config = platformConfigurations[platformType];
    if (!config) {
      return { isValid: false, message: t('validation.platformConfigNotFound', { platform: platformType }) };
    }

    // Validate post content length
    if (post.content.length > config.maxPostLength) {
      return { isValid: false, message: t('validation.postTooLong', { platform: platformType, max: config.maxPostLength }) };
    }

    // Validate number of images
    if (postMediaAssets.length > config.maxImages) {
      return { isValid: false, message: t('validation.tooManyImages', { platform: platformType, max: config.maxImages }) };
    }

    // Validate video support and length
    const hasVideo = postMediaAssets.some(asset => asset.mimeType.startsWith('video/'));
    if (hasVideo) {
      if (!config.supportsVideo) {
        return { isValid: false, message: t('validation.videoNotSupported', { platform: platformType }) };
      }
      // Temporarily removing video duration validation due to missing 'durationSeconds' in Asset type.
      // A proper solution would involve extending the Asset type or parsing metadata for duration.
      // if (config.maxVideoLengthSeconds && postMediaAssets.some(asset => asset.durationSeconds && asset.durationSeconds > config.maxVideoLengthSeconds)) {
      //   return { isValid: false, message: t('validation.videoTooLong', { platform: platformType, max: config.maxVideoLengthSeconds }) };
      // }
    }

    // Validate carousel support
    if (postMediaAssets.length > 1 && !config.supportsCarousel) {
      return { isValid: false, message: t('validation.carouselNotSupported', { platform: platformType }) };
    }

    // Validate comments support
    if (post.comment && post.comment.length > 0 && !config.supportsComments) {
      return { isValid: false, message: t('validation.commentsNotSupported', { platform: platformType }) };
    }

    // Validate tags support
    if (config.supportsTags === false && post.tags && post.tags.length > 0) {
      return { isValid: false, message: t('validation.tagsNotSupported', { platform: platformType }) };
    }

    // Validate categories support
    if (config.supportsCategories === false && post.categories && post.categories.length > 0) {
      return { isValid: false, message: t('validation.categoriesNotSupported', { platform: platformType }) };
    }

    // Validate privacy settings support
    // Assuming 'public' is generally supported if privacy settings are not explicitly supported
    if (config.supportsPrivacySettings === false && post.privacySetting && post.privacySetting !== 'public') {
      return { isValid: false, message: t('validation.privacySettingsNotSupported', { platform: platformType }) };
    }

    // Validate sounds support (e.g., TikTok)
    if (config.supportsSounds === false && post.hasSound) {
      return { isValid: false, message: t('validation.soundsNotSupported', { platform: platformType }) };
    }

    // Validate shorts support (e.g., YouTube Shorts)
    if (config.supportsShorts === false && post.isShort) {
      return { isValid: false, message: t('validation.shortsNotSupported', { platform: platformType }) };
    }

    // Validate stories support (e.g., Facebook/Instagram Stories)
    if (config.supportsStories === false && post.isStory) {
      return { isValid: false, message: t('validation.storiesNotSupported', { platform: platformType }) };
    }

    return { isValid: true };
  }

  return {
    platformConfigurations,
    getPlatformConfig: (platform: keyof SocialMediaPlatformConfigurations) => {
      return platformConfigurations[platform];
    },
    validatePostForPlatform,
  };
};
