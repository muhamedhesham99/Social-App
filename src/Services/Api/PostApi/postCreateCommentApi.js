import apiClient from "../ApiConfig";

async function postCreateCommentApi(postId, formData) {
  const payLoad = await apiClient.post(`/posts/${postId}/comments`, formData);

  return payLoad;
}

export default postCreateCommentApi;
