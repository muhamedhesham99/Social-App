import apiClient from "../ApiConfig";

async function getCommunityPostsApi() {
  const payLoad = await apiClient.get("/posts/feed?only=all&limit=20&page=1");

  return payLoad;
}

export default getCommunityPostsApi;
