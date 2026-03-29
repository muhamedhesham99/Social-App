import apiClient from "../ApiConfig";

async function getCommentRepliesApi(postId, commentId) {
  const payLoad = await apiClient.get(
    `/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
  );

  return payLoad;
}

export default getCommentRepliesApi;
