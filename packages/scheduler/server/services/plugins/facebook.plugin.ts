import type { PostDetails, PostResponse, Integration } from '../SchedulerPost.service';
import { BaseSchedulerPlugin } from '../SchedulerPost.service';

export class FacebookPlugin extends BaseSchedulerPlugin {
  readonly pluginName = 'facebook';

  protected init(options?: any): void {
    // Initialize Facebook API client or settings
    console.log('Facebook plugin initialized', options);
  }

  async validate(postDetails: PostDetails[]): Promise<string[]> {
    const errors: string[] = [];
    for (const detail of postDetails) {
      if (detail.message && detail.message.length > 63206) {
        errors.push('Post content is too long');
      }
      if (detail.media) {
        for (const media of detail.media) {
          if (media.type !== 'image' && media.type !== 'video') {
            errors.push(`Unsupported media type: ${media.type}, only image and video allowed`);
          }
          // Check file size (Facebook limit 4MB for photos)
          // Assuming path is URL or local, but can't check size here
        }
      }
      if (detail.poll) {
        errors.push('Polls are not supported on Facebook');
      }
      // Check for Facebook.com links
      if (detail.message && detail.message.includes('facebook.com')) {
        errors.push('Cannot post Facebook.com links');
      }
      // Check URL format if settings.url
      if ((detail as any).settings?.url) {
        try {
          new URL((detail as any).settings.url);
        } catch {
          errors.push('Invalid URL format in post content');
        }
      }
    }
    return errors;
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails[],
    integration: Integration
  ): Promise<PostResponse[]> {
    const responses: PostResponse[] = [];
    const [firstPost, ...comments] = postDetails;

    if (!firstPost) return responses;

    try {
      let finalId = '';
      let finalUrl = '';

      // Check if it's a video
      const isVideo = firstPost.media?.some(media => media.type === 'video' || media.path.includes('.mp4'));

      if (isVideo) {
        // Upload video
        // Mock: const { id: videoId, permalink_url } = await fetch(...).json();
        const videoId = `fb_video_${Date.now()}`;
        finalUrl = `https://www.facebook.com/reel/${videoId}`;
        finalId = videoId;
      } else {
        // Upload photos if any
        const uploadPhotos = firstPost.media?.length
          ? firstPost.media.map(() => ({ media_fbid: `fb_photo_${Date.now()}_${Math.random()}` })) // Mock
          : [];

        // Post to feed
        // Mock: const { id: postId, permalink_url } = await fetch(...).json();
        const postId = `fb_post_${Date.now()}`;
        finalUrl = `https://www.facebook.com/${integration.accountId}/posts/${postId}`;
        finalId = postId;
      }

      responses.push({
        id: firstPost.id,
        postId: finalId,
        releaseURL: finalUrl,
        status: 'published',
      });

      // Handle comments
      let commentId = finalId;
      for (const comment of comments) {
        // Mock add comment
        const commentPostId = `fb_comment_${Date.now()}`;
        responses.push({
          id: comment.id,
          postId: commentPostId,
          releaseURL: `${finalUrl}?comment_id=${commentPostId}`,
          status: 'published',
        });
        commentId = commentPostId;
      }

      this.emit('facebook:post:published', { postId: finalId, responses });
    } catch (error: unknown) {
      responses.push({
        id: firstPost.id,
        postId: '',
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      });
      this.emit('facebook:post:failed', { error: (error as Error).message });
    }

    return responses;
  }

  async update(
    id: string,
    accessToken: string,
    postId: string,
    updateDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse[]> {
    // Mock update
    const updatedPostId = `fb_updated_${postId}`;
    const response: PostResponse = {
      id: updateDetails.id,
      postId: updatedPostId,
      releaseURL: `https://www.facebook.com/${integration.accountId}/posts/${updatedPostId}`,
      status: 'updated',
    };
    this.emit('facebook:post:updated', { postId: updatedPostId, updateDetails });
    return [response];
  }

  async addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse[]> {
    // Mock add comment
    const commentId = `fb_comment_${Date.now()}`;
    const response: PostResponse = {
      id: commentDetails.id,
      postId: commentId,
      releaseURL: `https://www.facebook.com/${integration.accountId}/posts/${postId}?comment_id=${commentId}`,
      status: 'commented',
    };
    this.emit('facebook:comment:added', { commentId, postId, commentDetails });
    return [response];
  }
}