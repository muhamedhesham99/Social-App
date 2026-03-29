import apiClient from "../ApiConfig";

async function putBookmark_UnbookmarkPostApi(postId) {
  const payLoad = await apiClient.put(`/posts/${postId}/bookmark`);
  return payLoad
}

export default putBookmark_UnbookmarkPostApi;
