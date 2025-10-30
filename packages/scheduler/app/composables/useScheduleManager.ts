import type { Post } from "#layers/BaseDB/db/schema";


export const useScheduleManager = () => {
  const post = ref<Post[]>([]);

  const fetchPosts = async (timeFrame: "day" | "week" | "month") => {
    try {
      const response = await fetch('/api/v1/scheduler/posts');

      const data = await response.json();
      post.value = data;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  return {

  }
};
