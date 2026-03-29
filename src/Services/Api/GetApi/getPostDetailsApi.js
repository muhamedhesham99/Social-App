import apiClient from "../ApiConfig";

async function getPostDetailsApi(postId) {
  const payLoad = await apiClient.get(`/posts/${postId}`);

  return payLoad;
}

export default getPostDetailsApi;
