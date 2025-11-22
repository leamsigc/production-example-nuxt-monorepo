import { FacebookPlugin } from './plugins/facebook.plugin';
import { socialMediaAccountService, SocialMediaPlatform } from './../../../db/server/services/social-media-account.service';
import { account } from './../../../db/db/auth/auth';
import { auth } from './../../../auth/lib/auth';
import { PostWithAllData } from './../../../db/db/posts/posts';
import { SchedulerPluginConstructor, SchedulerPost } from './SchedulerPost.service';
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

      scheduler.use(this.matcher[platform]);
      const response = await scheduler.publish(
        post.id,
        socialMediaAccount.accessToken,
        post,
        [],
        account
      );
      console.log(response);


    });

  }
}
