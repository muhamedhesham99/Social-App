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
              src={
                myProfileData.cover ||
                "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/608756720_122167381748829517_1175172648295024406_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=2a1932&_nc_ohc=LZU5fY7VmnwQ7kNvwHqQRMu&_nc_oc=Adq7OC2UuCo6QB0ZUX9MSNQDwEu3jhghMSyPCbA7o_tg5XWGQDvXCMTgxuH0u3PXkBE&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=G-vtdeSWUAdmenhw5vLuJQ&_nc_ss=7a389&oh=00_Af0dyvR95T1UrHWk1n2HsVUAT5odF3Mm-hpTvFB96rmqCg&oe=69DCF8BC"
              }
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
