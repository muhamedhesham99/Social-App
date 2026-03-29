import apiClient from "../ApiConfig";

async function putFollow_UnfollowUserApi(userId) {
  const payLoad = await apiClient.put(`/users/${userId}/follow`);
  return payLoad;
}

export default putFollow_UnfollowUserApi;
