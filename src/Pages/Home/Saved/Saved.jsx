import getSavedPostsApi from "../../../Services/Api/GetApi/getSavedPostsApi";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./../../../Components/Shared/PostSkeleton";
import { TokenContext } from "../../../Context/TokenContext/TokenContect";
import { useContext } from "react";
import Post from "../../../Components/Shared/Post";

const Saved = () => {
  const { userToken } = useContext(TokenContext); // userToken
  const { data, isLoading } = useQuery({
    queryKey: ["savedPosts", userToken],
    queryFn: getSavedPostsApi,
  }); // tanStak query for handle the caching of api
  const savedPosts = data?.data?.data?.bookmarks; // all posts of the 'home/saved' path
  return (
    <>
      {isLoading
        ? Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)
        : [...savedPosts].reverse().map((post) => {
            // make a copy of original array where spread it in an array and then ake it reverse and map on it
            return <Post key={post.id} post={post} />;
          })}
    </>
  );
};

export default Saved;
