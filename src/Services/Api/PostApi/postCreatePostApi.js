import apiClient from "../ApiConfig";

async function postCreatePostApi(formData) {
  const payLoad = await apiClient.post("/posts", formData);

  return payLoad;
}

export default postCreatePostApi;
