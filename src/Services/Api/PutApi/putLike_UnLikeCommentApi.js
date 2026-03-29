import apiClient from "../ApiConfig";

async function putLike_UnLikeCommentApi(postId, commentId) {
  const payLoad = await apiClient.put(
    `/posts/${postId}/comments/${commentId}/like`,
  );
  return payLoad;
}

export default putLike_UnLikeCommentApi;
