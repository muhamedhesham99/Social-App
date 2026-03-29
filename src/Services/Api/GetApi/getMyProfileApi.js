import apiClient from "../ApiConfig";

async function getMyProfileApi() {
  const payLoad = await apiClient.get("/users/profile-data");

  return payLoad;
}

export default getMyProfileApi;
