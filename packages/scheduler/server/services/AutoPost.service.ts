import type { PostWithAllData } from '#layers/BaseDB/db/schema';
import { socialMediaAccountService, type SocialMediaPlatform } from '#layers/BaseDB/server/services/social-media-account.service';
import { SchedulerPost } from '#layers/BaseScheduler/server/services/SchedulerPost.service';
import type { SchedulerPluginConstructor } from '#layers/BaseScheduler/server/services/SchedulerPost.service';
import { FacebookPlugin } from '#layers/BaseScheduler/server/services/plugins/facebook.plugin';
export class AutoPostService {

  private matcher: Record<string, SchedulerPluginConstructor> = {
    facebook: FacebookPlugin,
  }

  async triggerSocialMediaPost(post: PostWithAllData): Promise<void> {
    // Implement the logic to trigger a social media post
    post.platformPosts.forEach(async (platformPost) => {
      console.log("#####");
      console.log(platformPost);
      console.log("#####");

      const platform = platformPost.platformPostId
      if (!platform) {
        return;
      }
      const user = post.user;
      const account = await socialMediaAccountService.getAccountsForPlatform(
        platform,
        user.id
      )
      const scheduler = new SchedulerPost({
        post: post,
        accounts: account
      });
      const socialMediaAccount = await socialMediaAccountService.getAccountByPlatformAndAccountId(
        user.id,
        platformPost.platformPostId as SocialMediaPlatform,
        platformPost.socialAccountId
      );

      if (!socialMediaAccount) {
        throw new Error(`No access token found for platform ${platform}`);
      }
      //@ts-ignore
      scheduler.use(this.matcher[platform]);

      const response = await scheduler.publish(
        post.id,
        socialMediaAccount.accessToken,
        post,
        [],
        account as any
      );
      console.log(response);


    });

  }
}
