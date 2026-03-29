import apiClient from "../ApiConfig";

async function getAllPostsApi(page, limit) {
  const payLoad = await apiClient.get(`/posts?page=${page}&limit=${limit}`);

  return payLoad;
}

export default getAllPostsApi;
