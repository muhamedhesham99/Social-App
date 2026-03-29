import apiClient from "../ApiConfig";

async function getSavedPostsApi() {
  const payLoad = await apiClient.get("/users/bookmarks");

  return payLoad;
}

export default getSavedPostsApi;
