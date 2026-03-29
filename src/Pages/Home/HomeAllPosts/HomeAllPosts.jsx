import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./../../../Components/Shared/PostSkeleton";
import { TokenContext } from "../../../Context/TokenContext/TokenContect";
import { useContext, useEffect, useRef, useState } from "react";
import getAllPostsApi from "./../../../Services/Api/GetApi/getAllPostsApi";
import Post from "../../../Components/Shared/Post";
import { FallingLines } from "react-loader-spinner";

const HomeAllPosts = () => {
  const { userToken } = useContext(TokenContext); // userToken
  const [page, setPage] = useState(0); // page of the get posts api to get more posts when reach to the bottom
  const [posts, setPosts] = useState([]); // combine posts in array to show all posts when show more not replace them
  const loadMoreRef = useRef(null); // loadMore element using when reach to it
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["homeAllPosts", userToken, page],
    queryFn: () => getAllPostsApi(page, 15),
  }); // tanStak query for handle the caching of api

  useEffect(() => {
    if (!loadMoreRef.current) return; // if not exist ref then return nothing
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && isFetching) {
        // check if the first entries of IntersectionObserver class isIntersecting and the data fetching then get next page of api
        setPage((prev) => prev + 1); // increase the number of pages
      }
    }); // observer class to use if reach to the end of posts to load more posts by api where get callback function get entries
    observer.observe(loadMoreRef.current); // in the mounting phase make the observer observe the element when hide or show to excute the functionality
    return () => observer.disconnect(); // when will unMount clear observer from memory by disconnect() func to prevent memory leak or infinity loop of api requests
  }, []); // useEffect mounting phase

  const allPosts = data?.data?.data?.posts; // all posts of the 'home' path

  useEffect(() => {
    if (allPosts) {
      setPosts((prev) => {
        const newPosts = allPosts.filter(
          (newPost) => !prev.some((p) => p.id === newPost.id),
        );
        return [...prev, ...newPosts];
      });
    }
  }, [allPosts]); // updating phase when allPosts changed, then make setPosts the prev data with new data of posts

  return (
    <>
      {isLoading
        ? Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)
        : posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
      <div
        className="flex items-center justify-center text-sm mt-3"
        ref={loadMoreRef}
      >
        {isFetching && (
          <FallingLines
            color="#7eacb5"
            width="100"
            visible={true}
            ariaLabel="falling-circles-loading"
          />
        )}
      </div>
    </>
  );
};

export default HomeAllPosts;
