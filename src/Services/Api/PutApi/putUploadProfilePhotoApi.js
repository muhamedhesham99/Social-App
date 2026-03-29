import apiClient from "../ApiConfig";

async function putUploadProfilePhotoApi(formData) {
  const payLoad = await apiClient.put("/users/upload-photo", formData);

  return payLoad;
}

export default putUploadProfilePhotoApi;
 