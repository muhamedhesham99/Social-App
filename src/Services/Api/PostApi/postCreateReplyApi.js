import apiClient from "../ApiConfig";

async function postCreateReplyApi(postId,commentId, formData) {
  const payLoad = await apiClient.post(`/posts/${postId}/comments/${commentId}/replies`, formData);

  return payLoad;
}

export default postCreateReplyApi;
