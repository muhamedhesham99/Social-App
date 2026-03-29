import getMyPostsApi from "../../../Services/Api/GetApi/getMyPostsApi";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./../../../Components/Shared/PostSkeleton";
import { TokenContext } from "../../../Context/TokenContext/TokenContect";
import { useContext } from "react";
import Post from "../../../Components/Shared/Post";

const MyPosts = () => {
  const { userToken } = useContext(TokenContext); // userToken
  const { data, isLoading } = useQuery({
    queryKey: ["myPosts", userToken],
    queryFn: getMyPostsApi,
  }); // tanStak query for handle the caching of api
  const myPosts = data?.data?.data?.posts; // all posts of the 'home/myposts' path
  return (
    <>
      {isLoading
        ? Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)
        : myPosts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
    </>
  );
};

export default MyPosts;
