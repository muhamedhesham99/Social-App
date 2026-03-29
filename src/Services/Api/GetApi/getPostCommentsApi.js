import apiClient from "../ApiConfig";

async function getPostCommentsApi(postId) {
  const payLoad = await apiClient.get(`/posts/${postId}/comments`);

  return payLoad;
}

export default getPostCommentsApi;
