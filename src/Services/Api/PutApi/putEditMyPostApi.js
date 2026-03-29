import apiClient from "../ApiConfig";

async function putEditMyPostApi(postId, formData) {
  const payLoad = await apiClient.put(`/posts/${postId}`, formData);
  return payLoad
}

export default putEditMyPostApi;
