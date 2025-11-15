import type { PostCreateBase, Asset } from '#layers/BaseDB/db/schema';

export interface TargetPlatform {
  accountId: string;
  platformType: string; // This will be `keyof typeof previewsMap` from NewPostModal.vue
}

export interface PostCreateBaseExtended extends Omit<PostCreateBase, 'targetPlatforms'> {
  targetPlatforms: TargetPlatform[];
  tags?: string[];
  categories?: string[];
  privacySetting?: 'public' | 'private' | 'unlisted';
  isShort?: boolean;
  isStory?: boolean;
  hasSound?: boolean;
}
