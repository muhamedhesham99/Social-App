import apiClient from "../ApiConfig";

async function deleteCommentApi(postId, commentId) {
  const payLoad = await apiClient.delete(
    `/posts/${postId}/comments/${commentId}`,
  );
  return payLoad;
}

export default deleteCommentApi;
