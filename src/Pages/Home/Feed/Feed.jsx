import getMyFeedApi from "../../../Services/Api/GetApi/getMyFeedApi";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./../../../Components/Shared/PostSkeleton";
import { TokenContext } from "../../../Context/TokenContext/TokenContect";
import { useContext } from "react";
import Post from "../../../Components/Shared/Post";

const Feed = () => {
  const { userToken } = useContext(TokenContext); // userToken
  const { data, isLoading } = useQuery({
    queryKey: ["feedPosts", userToken],
    queryFn: getMyFeedApi,
  }); // tanStak query for handle the caching of api
  const feedPosts = data?.data?.data?.posts; // all posts of the 'home/feed' path
  return (
    <>
      {isLoading
        ? Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)
        : feedPosts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
    </>
  );
};

export default Feed;
