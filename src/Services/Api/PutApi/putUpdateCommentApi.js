import apiClient from "../ApiConfig";

async function putUpdateCommentApi(postId, commentId, formData) {
  const payLoad = await apiClient.put(
    `/posts/${postId}/comments/${commentId}`,
    formData,
  );
  return payLoad;
}

export default putUpdateCommentApi;
