#!/bin/bash

# Check if a plugin name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <pluginname>"
  exit 1
fi

PLUGIN_NAME_KEBAB=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]\+/-/g' | sed 's/^-//;s/-$//')
PLUGIN_NAME_PASCAL=$(echo "$PLUGIN_NAME_KEBAB" | awk -F'-' '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' OFS='')

FILE_PATH="packages/scheduler/server/services/plugins/${PLUGIN_NAME_KEBAB}.plugin.ts"

# Create the directory if it doesn't exist
mkdir -p "$(dirname "$FILE_PATH")"

# Create the plugin file with base content
cat > "$FILE_PATH" << EOF
import type { PostDetails, PostResponse, Integration } from '../SchedulerPost.service';
import { BaseSchedulerPlugin } from '../SchedulerPost.service';

export class ${PLUGIN_NAME_PASCAL}Plugin extends BaseSchedulerPlugin {
  readonly pluginName = '${PLUGIN_NAME_KEBAB}';
  public exposedMethods?: string[] = [];

  protected init(options?: any): void {
    // Initialize ${PLUGIN_NAME_PASCAL} plugin
    console.log('${PLUGIN_NAME_PASCAL} plugin initialized', options);
  }

  async validate(postDetails: PostDetails): Promise<string> {
    const errors: string[] = [];
    // Add validation logic here
    return errors.join('; ');
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse> {
    try {
      // Implement post logic here
      const response: PostResponse = {
        id: postDetails.id,
        postId: 'mock_post_id', // Replace with actual post ID from API
        releaseURL: 'mock_release_url', // Replace with actual release URL from API
        status: 'published',
      };
      this.emit('${PLUGIN_NAME_KEBAB}:post:published', { postId: response.postId, response });
      return response;
    } catch (error: unknown) {
      const errorResponse: PostResponse = {
        id: postDetails.id,
        postId: '',
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      };
      this.emit('${PLUGIN_NAME_KEBAB}:post:failed', { error: (error as Error).message });
      return errorResponse;
    }
  }

  async update(
    id: string,
    accessToken: string,
    postId: string,
    updateDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse> {
    try {
      // Implement update logic here
      const response: PostResponse = {
        id: updateDetails.id,
        postId: postId,
        releaseURL: 'mock_updated_release_url', // Replace with actual updated release URL from API
        status: 'updated',
      };
      this.emit('${PLUGIN_NAME_KEBAB}:post:updated', { postId: response.postId, updateDetails });
      return response;
    } catch (error: unknown) {
      const errorResponse: PostResponse = {
        id: updateDetails.id,
        postId: postId,
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      };
      this.emit('${PLUGIN_NAME_KEBAB}:post:update:failed', { error: (error as Error).message });
      return errorResponse;
    }
  }

  async addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse> {
    try {
      // Implement add comment logic here
      const response: PostResponse = {
        id: commentDetails.id,
        postId: 'mock_comment_id', // Replace with actual comment ID from API
        releaseURL: 'mock_comment_release_url', // Replace with actual comment release URL from API
        status: 'commented',
      };
      this.emit('${PLUGIN_NAME_KEBAB}:comment:added', { commentId: response.postId, postId, commentDetails });
      return response;
    } catch (error: unknown) {
      const errorResponse: PostResponse = {
        id: commentDetails.id,
        postId: '',
        releaseURL: '',
        status: 'failed',
        error: (error as Error).message,
      };
      this.emit('${PLUGIN_NAME_KEBAB}:comment:failed', { error: (error as Error).message });
      return errorResponse;
    }
  }
}
EOF

chmod +x "$FILE_PATH"

echo "Plugin '${PLUGIN_NAME_PASCAL}Plugin' created at '$FILE_PATH'"

# Make the script itself executable
chmod +x scripts/plugins.sh
