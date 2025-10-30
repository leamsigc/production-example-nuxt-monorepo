import type { SocialMediaAccount } from "#layers/BaseDB/db/schema";

interface Connection {
  name: string;
  icon: string;
  url: string;
}

const connectionList = ref<Connection[]>([]);
const allConnections = ref<SocialMediaAccount[]>([]);

export const useConnectionManager = () => {

  const setConnectionList = () => {
    connectionList.value = [
      { name: 'Facebook', icon: 'logos:facebook', url: '#' },
      { name: 'Instagram', icon: 'logos:instagram', url: '#' },
      { name: 'Threads', icon: 'fa6-brands:square-threads', url: '#' },
      { name: 'X (Twitter)', icon: 'logos:twitter', url: '#' },
      { name: 'LinkedIn', icon: 'logos:linkedin', url: '#' },
      { name: 'YouTube', icon: 'logos:youtube', url: '#' },
      { name: 'TikTok', icon: 'logos:tiktok', url: '#' },
      { name: 'Pinterest', icon: 'logos:pinterest', url: '#' },
      { name: 'Mastodon', icon: 'logos:mastodon', url: '#' },
      { name: 'Bluesky', icon: 'fa6-brands:square-bluesky', url: '#' },
      { name: 'Google Business', icon: 'logos:google', url: '#' },
    ]
  }
  const getAllConnections = async (connections: SocialMediaAccount[]) => {
    allConnections.value = connections
  }

  return {
    connectionList,
    allConnections,
    setConnectionList,
    getAllConnections
  }
};
