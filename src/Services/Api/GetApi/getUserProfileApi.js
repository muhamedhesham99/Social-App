import apiClient from "../ApiConfig";

async function getUserProfileApi(userId) {
  const payLoad = await apiClient.get(`/users/${userId}/profile`);

  return payLoad;
}

export default getUserProfileApi;
