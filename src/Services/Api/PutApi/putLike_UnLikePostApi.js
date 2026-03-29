import apiClient from "../ApiConfig";

async function putLike_UnLikePostApi(postId) {
  const payLoad = await apiClient.put(`/posts/${postId}/like`);
  return payLoad;
}

export default putLike_UnLikePostApi;
