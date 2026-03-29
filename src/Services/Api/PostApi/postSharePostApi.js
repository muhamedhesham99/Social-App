import apiClient from "../ApiConfig";

async function postSharePostApi(postId, body) {
  const payLoad = await apiClient.post(`/posts/${postId}/share`, body);
  return payLoad;
}

export default postSharePostApi;
