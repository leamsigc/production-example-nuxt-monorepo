import type { FacebookPage } from '#layers/BaseConnect/utils/FacebookPages';

import { linkSocial } from "#layers/BaseAuth/lib/auth-client";
import type { SocialMediaAccount, SocialMediaComplete } from "#layers/BaseDB/db/schema";
import { useBusinessManager } from "../../business/composables/useBusinessManager";

interface Connection {
  name: string;
  icon: string;
  url: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'google' | 'github' | 'discord' | 'apple' | 'microsoft' | 'linkedin' | 'threads' | 'youtube' | 'pinterest' | 'mastodon' | 'bluesky';
}


const connectionList = ref<Connection[]>([]);

export const useConnectionManager = () => {
  const toast = useToast();
  const allConnections = ref<SocialMediaAccount[]>([]);
  const pagesList = ref<SocialMediaComplete[]>([]);
  const facebookPages = ref<FacebookPage[]>([]);
  const setConnectionList = () => {
    connectionList.value = [
      { name: 'Facebook', icon: 'logos:facebook', url: '#', platform: 'facebook' },
      { name: 'Instagram', icon: 'logos:instagram', url: '#', platform: "instagram" },
      { name: 'Threads', icon: 'fa6-brands:square-threads', url: '#', platform: "threads" },
      { name: 'X (Twitter)', icon: 'logos:twitter', url: '#', platform: "twitter" },
      { name: 'LinkedIn', icon: 'logos:linkedin', url: '#', platform: "linkedin" },
      { name: 'YouTube', icon: 'logos:youtube', url: '#', platform: "youtube" },
      { name: 'TikTok', icon: 'logos:tiktok', url: '#', platform: "tiktok" },
      { name: 'Pinterest', icon: 'logos:pinterest', url: '#', platform: "pinterest" },
      { name: 'Mastodon', icon: 'logos:mastodon', url: '#', platform: "mastodon" },
      { name: 'Bluesky', icon: 'fa6-brands:square-bluesky', url: '#', platform: "bluesky" },
      { name: 'Google Business', icon: 'logos:google', url: '#', platform: "google" },
    ]
  }
  const getAllConnections = async (connections: SocialMediaAccount[]) => {
    allConnections.value = connections
  }
  const HandleConnectTo = async (connection: Connection) => {
    try {
      const { activeBusinessId } = useBusinessManager()
      linkSocial({
        provider: connection.platform,
        callbackURL: `/api/v1/social-accounts/callback/${connection.platform}?businessId=${activeBusinessId.value}`,
      });
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  }
  const getPagesForIntegration = async (connectionId: string) => {
    try {
      const response = await $fetch<Promise<SocialMediaAccount[]>>('/api/v1/social-accounts?platformId=' + connectionId);

      if (connectionId === 'facebook') {
        facebookPages.value = (response as unknown as FacebookPage[])
      }
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  }
  const getAllSocialMediaAccounts = async () => {
    try {
      const response = await $fetch<Promise<SocialMediaComplete[]>>('/api/v1/social-accounts');
      pagesList.value = response
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  }
  const HandleConnectToFacebook = async (page: FacebookPage) => {
    try {
      const { activeBusinessId } = useBusinessManager()
      const res = await $fetch<Promise<SocialMediaAccount>>(`/api/v1/social-accounts/facebook/${page.id}`, {
        method: 'POST',
        body: { ...page, platformId: 'facebook', businessId: activeBusinessId.value },
      });
      console.log("######## Connect to Facebook #######");
      console.log(res);

      toast.add({
        title: 'Success',
        description: 'Successfully connected to Facebook page ' + page.name,
        icon: 'i-heroicons-check-circle',
        color: 'success',
      });

      await getAllSocialMediaAccounts();

    } catch (error) {
      console.error('Error adding business:', error);
      toast.add({
        title: 'Error',
        description: 'Failed to connect to Facebook page ' + page.name,
        icon: 'i-heroicons-x-circle',
        color: 'error',
      });
      throw error;
    }
  }

  return {
    connectionList,
    allConnections,
    pagesList,
    facebookPages,
    setConnectionList,
    getAllConnections,
    HandleConnectTo,
    getPagesForIntegration,
    HandleConnectToFacebook,
    getAllSocialMediaAccounts
  }
};
