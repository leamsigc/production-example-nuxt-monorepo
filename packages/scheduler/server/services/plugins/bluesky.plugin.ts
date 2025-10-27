import type { PostDetails, PostResponse, Integration } from '../SchedulerPost.service';
import { BaseSchedulerPlugin, type MediaContent } from '../SchedulerPost.service';
import { AtpAgent, RichText, AppBskyFeedPost, AppBskyFeedDefs, BlobRef } from '@atproto/api';

type AppBskyEmbedVideo = any;
type AppBskyVideoDefs = any;


import axios from 'axios';
import sharp from 'sharp';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';

// Helper to pause execution
const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Custom error for bad body responses
class BadBody extends Error {
  constructor(
    public readonly service: string,
    public readonly body: string,
    public readonly response: Response,
    message?: string,
  ) {
    super(message || `Bad body from ${service}: ${body}`);
  }
}


export class BlueskyPlugin extends BaseSchedulerPlugin {
  readonly pluginName = 'bluesky';
  public exposedMethods?: string[] = ["blueSkyMaxLength"];
  private agent!: AtpAgent;

  blueSkyMaxLength() {
    return 300;
  }




  protected init(options?: { serviceUrl: string }): void {
    this.agent = new AtpAgent({ service: options?.serviceUrl || 'https://bsky.social' });
    console.log('Bluesky plugin initialized', options);
  }

  async validate(postDetails: PostDetails): Promise<string[]> {
    const errors: string[] = [];
    if (!postDetails.message || postDetails.message.trim() === '') {
      errors.push('Post message cannot be empty.');
    }
    // Additional validation logic can be added here, e.g., media checks, length limits
    return errors;
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails,
    comments: PostDetails[],
    integration: Integration
  ): Promise<PostResponse[]> {
    const responses: PostResponse[] = [];
    try {
      await this.agent.login({
        identifier: integration.username,
        password: accessToken,
      });

      const rt = new RichText({ text: postDetails.message });
      await rt.detectFacets(this.agent);

      // Separate images and videos
      const imageMedia =
        postDetails.media?.filter((p) => p.type === 'image') || [];
      const videoMedia =
        postDetails.media?.filter((p) => p.type === 'video') || [];

      // Upload images
      const images = await Promise.all(
        imageMedia.map(async (p) => {
          const { buffer, width, height } = await this.reduceImageBySize(p.path);
          return {
            width,
            height,
            buffer: await this.agent.uploadBlob(buffer),
          };
        })
      );

      // Upload videos (only one video per post is supported by Bluesky)
      let videoEmbed: AppBskyEmbedVideo | null = null;
      if (videoMedia.length > 0) {
        videoEmbed = await this.uploadVideo(this.agent, videoMedia[0].path);
      }

      // Determine embed based on media types
      let embed: any = {};
      if (videoEmbed) {
        // If there's a video, use video embed (Bluesky supports only one video per post)
        embed = videoEmbed;
      } else if (images.length > 0) {
        // If there are images but no video, use image embed
        embed = {
          $type: 'app.bsky.embed.images',
          images: images.map((p, index) => ({
            alt: imageMedia?.[index]?.alt || '',
            image: p.buffer.data.blob,
            aspectRatio: {
              width: p.width,
              height: p.height,
            },
          })),
        };
      }

      const postRecord: AppBskyFeedPost.Record = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
        ...(Object.keys(embed).length > 0 ? { embed } : {}),
      };

      const blueskyResponse = await this.agent.api.app.bsky.feed.post.create(
        { repo: this.agent.session?.did || '' },
        postRecord,
      );

      const mainPostResponse: PostResponse = {
        id: postDetails.id,
        postId: blueskyResponse.uri,
        releaseURL: `https://bsky.app/profile/${this.agent.session?.handle}/post/${blueskyResponse.uri.split('/').pop()}`,
        status: 'published',
      };
      responses.push(mainPostResponse);
      this.emit('bluesky:post:published', { postId: mainPostResponse.postId, response: mainPostResponse });

      if (postDetails.comments && postDetails.comments.length > 0) {
        for (const comment of postDetails.comments) {
          const commentResponse = await this.addComment(
            comment.id,
            accessToken,
            mainPostResponse.postId,
            comment,
            integration
          );
          responses.push(...commentResponse);
        }
      }

      return responses;
    } catch (error: unknown) {
      const errorResponse: PostResponse = {
        id: postDetails.id,
        postId: '',
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      };
      responses.push(errorResponse);
      this.emit('bluesky:post:failed', { error: (error as Error).message });
      return responses;
    }
  }

  async update(
    id: string,
    accessToken: string,
    postId: string,
    updateDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse[]> {
    const responses: PostResponse[] = [];
    try {
      await this.agent.login({
        identifier: integration.username,
        password: accessToken,
      });

      // Delete the old post
      const rkeyToDelete = postId.split('/').pop();
      if (this.agent.session?.did && rkeyToDelete) {
        await this.agent.api.com.atproto.repo.deleteRecord({
          repo: this.agent.session.did,
          collection: 'app.bsky.feed.post',
          rkey: rkeyToDelete,
        });
      }


      // Create a new post with updated content
      const rt = new RichText({ text: updateDetails.message });
      await rt.detectFacets(this.agent);

      const postRecord: AppBskyFeedPost.Record = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
      };

      const blueskyResponse = await this.agent.api.app.bsky.feed.post.create(
        { repo: this.agent.session?.did || '' },
        postRecord,
      );

      const mainPostResponse: PostResponse = {
        id: updateDetails.id,
        postId: blueskyResponse.uri,
        releaseURL: `https://bsky.app/profile/${this.agent.session?.handle}/post/${blueskyResponse.uri.split('/').pop()}`,
        status: 'updated',
      };
      responses.push(mainPostResponse);
      this.emit('bluesky:post:updated', { postId: mainPostResponse.postId, updateDetails });

      if (updateDetails.comments && updateDetails.comments.length > 0) {
        // For updates, we might need a more sophisticated logic to update existing comments
        // or add new ones. For now, we'll just add new comments.
        for (const comment of updateDetails.comments) {
          const commentResponse = await this.addComment(
            comment.id,
            accessToken,
            mainPostResponse.postId,
            comment,
            integration
          );
          responses.push(...commentResponse);
        }
      }

      return responses;
    } catch (error: unknown) {
      const errorResponse: PostResponse = {
        id: updateDetails.id,
        postId: postId,
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      };
      responses.push(errorResponse);
      this.emit('bluesky:post:update:failed', { error: (error as Error).message });
      return responses;
    }
  }

  async addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse[]> {
    const responses: PostResponse[] = [];
    try {
      await this.agent.login({
        identifier: integration.username,
        password: accessToken,
      });

      const rt = new RichText({ text: commentDetails.message });
      await rt.detectFacets(this.agent);

      const parentUri = postId;
      const threadResponse = await this.agent.api.app.bsky.feed.getPostThread({ uri: parentUri });

      if (!threadResponse.data.thread || !threadResponse.data.thread.post) {
        throw new Error('Parent post not found for commenting.');
      }

      const parentRecord = threadResponse.data.thread.post as AppBskyFeedDefs.PostView;

      const commentRecord: AppBskyFeedPost.Record = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
        reply: {
          root: {
            uri: parentRecord.uri,
            cid: parentRecord.cid,
          },
          parent: {
            uri: parentRecord.uri,
            cid: parentRecord.cid,
          },
        },
      };

      const blueskyResponse = await this.agent.api.app.bsky.feed.post.create(
        { repo: this.agent.session?.did || '' },
        commentRecord,
      );

      const response: PostResponse = {
        id: commentDetails.id,
        postId: blueskyResponse.uri,
        releaseURL: `https://bsky.app/profile/${this.agent.session?.handle}/post/${blueskyResponse.uri.split('/').pop()}`,
        status: 'commented',
      };
      responses.push(response);
      this.emit('bluesky:comment:added', { commentId: response.postId, postId, commentDetails });

      if (commentDetails.comments && commentDetails.comments.length > 0) {
        for (const nestedComment of commentDetails.comments) {
          const nestedCommentResponse = await this.addComment(
            nestedComment.id,
            accessToken,
            response.postId, // The parent for nested comments is the current comment
            nestedComment,
            integration
          );
          responses.push(...nestedCommentResponse);
        }
      }

      return responses;
    } catch (error: unknown) {
      const errorResponse: PostResponse = {
        id: commentDetails.id,
        postId: '',
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      };
      responses.push(errorResponse);
      this.emit('bluesky:comment:failed', { error: (error as Error).message });
      return responses;
    }
  }


  async reduceImageBySize(url: string, maxSizeKB = 976) {
    try {
      // Fetch the image from the URL
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      let imageBuffer = Buffer.from(response.data);

      // Use sharp to get the metadata of the image
      const metadata = await sharp(imageBuffer).metadata();
      let width = metadata.width!;
      let height = metadata.height!;

      // Resize iteratively until the size is below the threshold
      while (imageBuffer.length / 1024 > maxSizeKB) {
        width = Math.floor(width * 0.9); // Reduce dimensions by 10%
        height = Math.floor(height * 0.9);

        // Resize the image
        const resizedBuffer = await sharp(imageBuffer)
          .resize({ width, height })
          .toBuffer();

        imageBuffer = resizedBuffer;

        if (width < 10 || height < 10) break; // Prevent overly small dimensions
      }

      return { width, height, buffer: imageBuffer };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }
  async uploadVideo(
    agent: AtpAgent,
    videoPath: string
  ): Promise<AppBskyEmbedVideo> {
    const { data: serviceAuth } = await agent.com.atproto.server.getServiceAuth({
      aud: `did:web:${new URL(agent.service.toString()).host}`,
      lxm: 'com.atproto.repo.uploadBlob',
      exp: Date.now() / 1000 + 60 * 30, // 30 minutes
    });

    async function downloadVideo(
      url: string
    ): Promise<{ video: Buffer; size: number }> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const video = Buffer.from(arrayBuffer);
      const size = video.length;
      return { video, size };
    }

    const video = await downloadVideo(videoPath);

    console.log('Downloaded video', videoPath, video.size);

    const uploadUrl = new URL(
      'https://video.bsky.app/xrpc/app.bsky.video.uploadVideo'
    );
    uploadUrl.searchParams.append('did', agent.session!.did);
    uploadUrl.searchParams.append('name', videoPath.split('/').pop()!);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceAuth.token}`,
        'Content-Type': 'video/mp4',
        'Content-Length': video.size.toString(),
      },
      body: new Blob([new Uint8Array(video.video)], { type: 'video/mp4' }),
    });

    const jobStatus = (await uploadResponse.json()) as AppBskyVideoDefs;
    console.log('JobId:', jobStatus.jobId);
    let blob: BlobRef | undefined = jobStatus.blob;
    const videoAgent = new AtpAgent({ service: 'https://video.bsky.app' });

    while (!blob) {
      // Casting to any to bypass TypeScript error for 'app' property, as it might be a type definition issue.
      const { data: status } = await (videoAgent as any).app.bsky.video.getJobStatus({
        jobId: jobStatus.jobId,
      });
      console.log(
        'Status:',
        status.jobStatus.state,
        status.jobStatus.progress || ''
      );
      if (status.jobStatus.blob) {
        blob = status.jobStatus.blob;
      }

      if (status.jobStatus.state === 'JOB_STATE_FAILED') {
        throw new BadBody(
          'bluesky',
          JSON.stringify({}),
          {} as any,
          'Could not upload video, job failed'
        );
      }

      await timer(30000);
    }

    console.log('posting video...');

    return {
      $type: 'app.bsky.embed.video',
      video: blob,
    } satisfies AppBskyEmbedVideo;
  }
}
