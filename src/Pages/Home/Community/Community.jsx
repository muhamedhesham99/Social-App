import getCommunityPostsApi from "../../../Services/Api/GetApi/getCommunityPostsApi";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./../../../Components/Shared/PostSkeleton";
import { TokenContext } from "../../../Context/TokenContext/TokenContect";
import { useContext } from "react";
import Post from "../../../Components/Shared/Post";

const Community = () => {
  const { userToken } = useContext(TokenContext); // userToken
  const { data, isLoading } = useQuery({
    queryKey: ["communityPosts", userToken],
    queryFn: getCommunityPostsApi,
  }); // tanStak query for handle the caching of api

  const communityPosts = data?.data?.data?.posts; // all posts of the 'home/community' path
  return (
    <>
      {isLoading
        ? Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)
        : communityPosts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
    </>
  );
};

export default Community;
