import type { SocialMediaComplete } from "#layers/BaseDB/db/schema";


export const useSocialMediaManager = () => {

  const pagesList = useState<SocialMediaComplete[]>("socialMedia:List", () => []);

  const getAllSocialMediaAccounts = async () => {
    try {
      const response = await $fetch<Promise<SocialMediaComplete[]>>('/api/v1/social-accounts');
      pagesList.value = response
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  }


  return {
    getAllSocialMediaAccounts,
    pagesList
  }

}
