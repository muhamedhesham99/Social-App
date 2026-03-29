import apiClient from "../ApiConfig";

async function getMyPostsApi() {
  const payLoad = await apiClient.get("/posts/feed?only=me");

  return payLoad;
}

export default getMyPostsApi;