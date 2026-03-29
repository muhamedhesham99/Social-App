import apiClient from "../ApiConfig";

async function patchChangePasswordApi(formData) {
  const payLoad = await apiClient.patch("/users/change-password", formData);
  return payLoad;
}

export default patchChangePasswordApi;
