import { type Post, type SocialMediaAccount as Integration } from '#layers/BaseDB/db/schema';
import { EventEmitter } from 'events';

// Simplified types based on the core requirements for SchedulerPost
export type { Integration };
export type PostResponse = {
  id: string;
  postId: string;
  releaseURL: string;
  status: string;
  error?: string;
};

export type PollDetails = {
  options: string[]; // Array of poll options
  duration: number; // Duration in hours for which the poll will be active
};

export type MediaContent = {
  type: 'image' | 'video';
  path: string;
  alt?: string;
  thumbnail?: string;
  thumbnailTimestamp?: number;
};

export type PostDetails<T = Record<string, unknown>> = {
  id: string;
  message: string;
  settings: T;
  media?: MediaContent[];
  poll?: PollDetails;
};


export interface SchedulerPlugin {
  readonly pluginName: string;
  readonly exposedMethods?: string[];
  [key: string]: unknown; // Allow for additional properties

  onRegister?(scheduler: SchedulerPost): void;
  onDestroy?(): void;

  validate(postDetail: PostDetails): Promise<string>;
  post(
    id: string,
    accessToken: string,
    postDetail: PostDetails,
    integration: Integration
  ): Promise<PostResponse>;
  update(
    id: string,
    accessToken: string,
    postId: string,
    updateDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse>;
  addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse>;
}

export interface SchedulerPluginConstructor {
  new(scheduler: SchedulerPost, options?: any): BaseSchedulerPlugin;
  pluginName: string;
}

export abstract class BaseSchedulerPlugin implements SchedulerPlugin {
  abstract readonly pluginName: string;
  public scheduler: SchedulerPost;
  public exposedMethods?: string[];
  [key: string]: unknown;

  // Optional methods
  onRegister?(scheduler: SchedulerPost): void;
  onDestroy?(): void;

  constructor(scheduler: SchedulerPost, options?: any) {
    this.scheduler = scheduler;
    this.init(options);
  }

  protected abstract init(options?: any): void;

  protected emit(event: string, ...args: unknown[]) {
    this.scheduler.emit(event, ...args);
  }

  abstract validate(postDetail: PostDetails): Promise<string>;
  abstract post(
    id: string,
    accessToken: string,
    postDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse>;
  abstract update(
    id: string,
    accessToken: string,
    postId: string,
    updateDetail: PostDetails,
    integration: Integration
  ): Promise<PostResponse>;
  abstract addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: PostDetails,
    integration: Integration
  ): Promise<PostResponse>;
  abstract addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: Post,
    integration: Integration
  ): Promise<PostResponse>;
}

class SchedulerPost extends EventEmitter {
  private post: Post | null = null;

  private plugins: Map<string, SchedulerPlugin> = new Map();
  [key: string]: unknown;

  constructor(post: Post) {
    super();
    this.post = post
  }



  use(pluginClass: SchedulerPluginConstructor, options?: any): this {
    const pluginName = pluginClass.pluginName;
    if (this.plugins.has(pluginName)) {
      throw new Error(`Plugin ${pluginName} already registered`);
    }

    const plugin = new pluginClass(this, options);
    this.plugins.set(pluginName, plugin);
    plugin.onRegister?.(this);

    const exposedMethods = plugin.exposedMethods || [];
    exposedMethods.forEach(method => {
      if (!(plugin)[method]) {
        throw new Error(`Method ${method} not found on plugin ${pluginName}`);
      }
      this[method] = (plugin[method] as Function).bind(plugin);
    });

    return this;
  }

  getPlugin(name: string): SchedulerPlugin | undefined {
    return this.plugins.get(name);
  }

  destroy() {
    this.plugins.forEach(plugin => plugin.onDestroy?.());
    this.plugins.clear();
  }

  async validate(postDetails: Post): Promise<{ [pluginName: string]: string[] }> {
    const errors: { [pluginName: string]: string[] } = {};
    for (const [pluginName, plugin] of this.plugins.entries()) {
      const pluginErrors = await plugin.validate(postDetails);
      if (pluginErrors.length > 0) {
        errors[pluginName] = pluginErrors;
      }
    }
    return errors;
  }

  private async executeOnPlugins(
    action: 'post' | 'update' | 'addComment',
    params: unknown[],
    integrations: Integration[],
    eventPrefix: string,
    extraData: Record<string, unknown> = {}
  ): Promise<{ [integrationId: string]: PostResponse[] }> {
    const results: { [integrationId: string]: PostResponse[] } = {};
    const promises = integrations.map(async (integration) => {
      const plugin = this.plugins.get(integration.platform);
      if (plugin) {
        try {
          const responses = await (plugin[action] as (...args: unknown[]) => Promise<PostResponse[]>)(...params, integration);
          results[integration.id] = responses;
          this.emit(`${eventPrefix}:published`, { integrationId: integration.id, responses, ...extraData });
        } catch (error: unknown) {
          this.emit(`${eventPrefix}:failed`, {
            pluginName: integration.platform,
            error: (error as Error).message || 'Unknown error during plugin execution',
            integrationId: integration.id,
            ...extraData,
          });
        }
      } else {
        this.emit(`${eventPrefix}:failed`, {
          pluginName: integration.platform,
          error: 'Plugin not registered for this integration',
          integrationId: integration.id,
          ...extraData,
        });
      }
    });

    await Promise.allSettled(promises);
    return results;
  }

  async publish(
    id: string,
    accessToken: string,
    postDetails: Post,
    integrations: Integration[]
  ): Promise<{ [integrationId: string]: PostResponse }> {
    const validationErrors = await this.validate(postDetails);
    if (Object.keys(validationErrors).length > 0) {
      this.emit('post:validation-failed', validationErrors);
      return {};
    }

    return this.executeOnPlugins('post', [id, accessToken, postDetails], integrations, 'post', { postDetails });
  }

  async update(
    id: string,
    accessToken: string,
    postId: string,
    updateDetails: Post,
    integrations: Integration[]
  ): Promise<{ [integrationId: string]: PostResponse }> {
    return this.executeOnPlugins('update', [id, accessToken, postId, updateDetails], integrations, 'post:update', { postId, updateDetails });
  }

  async addComment(
    id: string,
    accessToken: string,
    postId: string,
    commentDetails: Post,
    integrations: Integration[]
  ): Promise<{ [integrationId: string]: PostResponse }> {
    return this.executeOnPlugins('addComment', [id, accessToken, postId, commentDetails], integrations, 'comment:add', { postId, commentDetails });
  }
}
