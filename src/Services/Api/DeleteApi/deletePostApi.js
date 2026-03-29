import apiClient from "../ApiConfig";

async function deletePostApi(postId) {
  const payLoad = await apiClient.delete(`/posts/${postId}`);
  return payLoad;
}

export default deletePostApi;
