import apiClient from "../ApiConfig";

async function postRegisterApi(formData) {
  const payLoad = await apiClient.post(
    "/users/signup",
    formData,
  );

  return payLoad;
}

export default postRegisterApi;
