import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import getUserProfileApi from "./../../Services/Api/GetApi/getUserProfileApi";
import Loading from "../../Components/Shared/Loading";
import ProfileCard from "../../Components/Shared/ProfileCard";
import getUserPostsApi from "../../Services/Api/GetApi/getUserPostsApi";
import PostSkeleton from "../../Components/Shared/PostSkeleton";
import Post from "../../Components/Shared/Post";
import putFollow_UnfollowUserApi from "../../Services/Api/PutApi/putFollow_UnfollowUserApi";
import { useContext, useLayoutEffect, useState } from "react";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { userId } = useParams(); // id of the user

  const myClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfileApi(userId),
  }); // tansStack query for get user profile data
  const userProfileData = userData?.data?.data?.user;

  const { data: userPosts, isLoading: loadingUserProfilePosts } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPostsApi(userId),
  }); // tansStack query for get user profile Posts
  const userProfilePosts = userPosts?.data?.data?.posts;

  const {
    userData: { _id: userLoginId },
  } = useContext(userContext); // userData fo user login

  const [followBtn, setFollowBtn] = useState(null); // for Follow Btn where if the login user is Followed the user, then the ui showing the Followed text

  useLayoutEffect(() => {
    setFollowBtn(
      userProfileData?.followers?.some((user) => user._id === userLoginId), // use some func where return boolean true if the condation statement is approved
    ); // set the boolean data returned from api
  }, [userProfilePosts]); // mounting and update phase of layout effect where done before ui render

  const invalidateQueries = [
    "postAllComments", // all comments of the post
    "postDetails", // post details page
    "homeAllPosts", // home All Posts page
    "feedPosts", // feed Posts page
    "myPosts", // my Posts page
    "communityPosts", // community Posts page
    "savedPosts", // saved Posts page
    "profilePosts", // my profile data as number of posts and bookmarks and following
    "myProfile", // my profile posts
  ]; // array of invalid queries where i want to revalidate or refetch it

  async function handleFollow_UnFollow() {
    setFollowBtn((prev) => !prev); // setState the Follow Btn view
    const payload = await putFollow_UnfollowUserApi(userId); // api call to Follow/UnFollow

    if (payload.data.data.following) {
      toast.success(`You followed ${userProfileData.name}`);
    } else {
      toast.success(`Unfollow ${userProfileData.name}`);
    }
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on Follow/UnFollow Btn
  return (
    <>
      {!userProfileData ? (
        <Loading />
      ) : (
        <main className="grid grid-cols-1 w-[95%] 2xl:w-[85%] mx-auto min-h-screen">
          <section id="coverImage">
            <img
              src={
                userProfileData.cover ||
                `https://marketplace.canva.com/EAEB97jvqIY/5/0/800w/canva-blue-and-pink-classy-photo-cherry-blossom-inspirational-quotes-facebook-cover-N4CEYt06_Vg.jpg`
              }
              alt="cover image"
              className="object-fill w-full h-60 rounded-t-3xl"
            />
          </section>
          <section
            id="profileSection"
            className="relative bg-white h-70 rounded-b-3xl"
          >
            <ProfileCard
              myProfileData={userProfileData}
              userProfilePosts={userProfilePosts}
              isUserProfile
              handleFollow_UnFollow={handleFollow_UnFollow}
              followBtn={followBtn}
            />
          </section>
          <section
            id="postsProfile"
            className="w-[80%] xl:w-[90%] 2xl:w-[95%] mx-auto"
          >
            {loadingUserProfilePosts
              ? Array.from({ length: 10 }, (_, index) => (
                  <PostSkeleton key={index} />
                ))
              : userProfilePosts.map((post) => {
                  return <Post key={post.id} post={post} />;
                })}
          </section>
        </main>
      )}
    </>
  );
};

export default UserProfile;
