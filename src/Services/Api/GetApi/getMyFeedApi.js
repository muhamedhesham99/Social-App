import apiClient from "../ApiConfig";

async function getMyFeedApi() {
  const payLoad = await apiClient.get(
    "/posts/feed?only=following&limit=20&page=1",
  );

  return payLoad;
}

export default getMyFeedApi;
