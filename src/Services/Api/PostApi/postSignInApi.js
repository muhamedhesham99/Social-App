import apiClient from "../ApiConfig";

async function postSignInApi(formData) {
  const payLoad = await apiClient.post("/users/signin", formData);
  return payLoad;
}

export default postSignInApi;
