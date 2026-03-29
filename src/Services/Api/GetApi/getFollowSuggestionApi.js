import apiClient from "../ApiConfig";

async function getFollowSuggestionApi(page, limit) {
  const payLoad = await apiClient.get(
    `/users/suggestions?page=${page}&limit=${limit}`,
  );

  return payLoad;
}

export default getFollowSuggestionApi;
