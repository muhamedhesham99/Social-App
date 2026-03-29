import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TokenContext } from "../../Context/TokenContext/TokenContect";
import ProfileCard from "../../Components/Shared/ProfileCard";
import getMyPostsApi from "../../Services/Api/GetApi/getMyPostsApi";
import getMyProfileApi from "../../Services/Api/GetApi/getMyProfileApi";
import Post from "../../Components/Shared/Post";
import PostSkeleton from "../../Components/Shared/PostSkeleton";
import Loading from "../../Components/Shared/Loading";

export const MyProfile = () => {
  const { userToken } = useContext(TokenContext);

  const { data: profileData } = useQuery({
    queryKey: ["myProfile", userToken],
    queryFn: getMyProfileApi,
  });
  const myProfileData = profileData?.data?.data?.user;

  const { data: profilePosts, isLoading: loadingProfilePosts } = useQuery({
    queryKey: ["profilePosts", userToken],
    queryFn: getMyPostsApi,
  });
  const profilePostsData = profilePosts?.data?.data?.posts;

  return (
    <>
      {!myProfileData ? (
        <Loading />
      ) : (
        <main className="grid grid-cols-1 w-[95%] 2xl:w-[85%] mx-auto min-h-screen">
          <section id="coverImage">
            <img
              src={myProfileData.cover}
              alt="cover image"
              className="object-fill w-full h-60 rounded-t-3xl"
            />
          </section>
          <section
            id="profileSection"
            className="relative bg-white h-100 rounded-b-3xl"
          >
            <ProfileCard
              myProfileData={myProfileData}
              profilePostsData={profilePostsData}
            />
          </section>
          <section
            id="postsProfile"
            className="w-[80%] xl:w-[90%] 2xl:w-[95%] mx-auto"
          >
            {loadingProfilePosts
              ? Array.from({ length: 10 }, (_, index) => (
                  <PostSkeleton key={index} />
                ))
              : profilePostsData.map((post) => {
                  return <Post key={post.id} post={post} />;
                })}
          </section>
        </main>
      )}
    </>
  );
};
