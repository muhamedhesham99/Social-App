import apiClient from "../ApiConfig";

async function getUserPostsApi(userId) {
  const payLoad = await apiClient.get(`/users/${userId}/posts`);

  return payLoad;
}

export default getUserPostsApi;
