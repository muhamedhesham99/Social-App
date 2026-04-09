import { Card, CardBody, CardHeader, Image, Chip, Button } from "@heroui/react";
import { FaUserGroup } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { useContext, useRef } from "react";
import putUploadProfilePhotoApi from "../../Services/Api/PutApi/putUploadProfilePhotoApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import { SlUserFollow } from "react-icons/sl";
import { FaCheck } from "react-icons/fa";
const ProfileCard = ({
  myProfileData,
  profilePostsData,
  isUserProfile,
  handleFollow_UnFollow,
  followBtn,
}) => {
  /*********************************************** Start use Hooks ***************************************************/
  const myClient = useQueryClient(); // query client of project
  const photoRef = useRef(null); // useRef of Photo of profile
  const { userData, setUserData } = useContext(userContext); // userData to update photo and put on localStorage
  const invalidateQueries = ["myProfile", "profilePosts"]; // array of invalid queries where i want to revalidate or refetch it
  const { mutate } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: (data) => {
      toast.success(data.data.message); // show success toast
      invalidateQueries.forEach((key) => {
        myClient.invalidateQueries({
          queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
        });
      }); // live changed photo and myPosts
      const newUserData = { ...userData, photo: `${data.data.data.photo}` }; //upload userData object
      setUserData(newUserData); // set new data of user
      localStorage.setItem("userData", JSON.stringify(newUserData)); // updata the localStorage
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
    },
  });
  /*********************************************** End use Hooks ***************************************************/

  function uploadPhoto(photo) {
    const formData = new FormData(); // form to append the data to send via api
    formData.append("photo", photo);
    return putUploadProfilePhotoApi(formData);
  } // function that handle the upload profile photo

  return (
    <Card className="flex flex-col rounded-3xl border border-white/60 bg-white/92 p-3 backdrop-blur-xl absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] ">
      {/************************ Start Header of Card ************************/}
      <CardHeader className="flex justify-between items-center  flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div id="leftHeader" className="flex items-end gap-4 min-w-fit">
          <div id="profileImage" className="relative group">
            {/******************** Start Image Avatar of user card *****************************/}
            <Image
              alt={myProfileData.name}
              height={112}
              radius="sm"
              src={
                myProfileData.photo}
              width={112}
              className="rounded-full border-4 border-white object-cover shadow-md ring-2 ring-secondary "
            />
            {/******************** End Image Avatar of user card *****************************/}
            {/******************** Start icon for upload photo *****************************/}
            {!isUserProfile && ( // if userLogin Profile then show the upload photo icon of profile image
              <div
                id="uploadPhoto"
                className="z-100 absolute bottom-0 -right-[10%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={photoRef}
                  onChange={(e) => {
                    const photo = e.target.files[0]; // uploaded photo
                    mutate(photo);
                  }}
                />
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  color="warning"
                  variant="faded"
                  onPress={() => photoRef.current.click()}
                >
                  <CameraIcon />
                </Button>
              </div>
            )}
            {/******************** End icon for upload photo *****************************/}
          </div>
          <div className="flex flex-col pb-1">
            {/******************** Start name of user profile *****************************/}
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {myProfileData.name}
            </h1>
            {/******************** Start name of user profile *****************************/}
            <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
              @{myProfileData.username}
            </p>
            {/******************** End name of user profile *****************************/}
            {!isUserProfile && ( // if the userLogin profile then show the chip tell Route posts member
              <Chip
                size="md"
                startContent={<FaUserGroup />}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-secondary bg-accent1 px-3 py-1 text-xs font-bold text-primary"
              >
                Route Posts member
              </Chip>
            )}
          </div>
        </div>
        {/*********************** Start Followers, Following, Bookmarks counts ********************/}
        <div
          id="rightHeader"
          className="grid w-full grid-cols-3 gap-2 lg:w-130"
        >
          <div className="flex flex-col justify-center items-center border border-secondary p-3 sm:p-4 rounded-2xl bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
              Followers
            </span>
            <span className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {myProfileData.followersCount}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center border border-secondary p-3 sm:p-4 rounded-2xl bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
              Following
            </span>
            <span className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {myProfileData.followingCount}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center border border-secondary p-3 sm:p-4 rounded-2xl bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
              Bookmarks
            </span>
            <span className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {myProfileData.bookmarksCount}
            </span>
          </div>
        </div>
        {/*********************** End Followers, Following, Bookmarks counts ********************/}
      </CardHeader>
      {/************************ End Header of Card ************************/}
      {/************************ Start Body of Card ************************/}
      {!isUserProfile ? ( // if the userLogin Profile then hide follow Btn and show about and myposts, saveedPosts counter
        <CardBody className="grid grid-cols-12 min-h-50 mt-5 gap-4">
          <div
            id="leftBody"
            className="col-span-8 rounded-2xl border border-secondary bg-slate-50 p-4"
          >
            <h2 className="text-sm font-extrabold text-slate-800">About</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {/************** Start userLogin email ****************/}
              <p className="flex items-center gap-2">
                <CiMail />
                {myProfileData.email}
              </p>
              {/************** End userLogin email ****************/}
              <p className="flex items-center gap-2">
                <FaUserGroup />
                Active on Route Posts
              </p>
            </div>
          </div>
          <div
            id="rightBody"
            className="col-span-4 rounded-2xl grid grid-cols-1 gap-3 lg:grid-cols-1"
          >
            <div className="rounded-2xl border border-secondary bg-accent1 px-4 py-3  flex flex-col justify-center min-w-fit">
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                MY POSTS
              </span>
              <span className="mt-1 text-2xl font-black text-slate-900">
                {profilePostsData?.length}
              </span>
            </div>
            <div className="rounded-2xl border border-secondary bg-accent1 px-4 py-3 flex flex-col justify-center min-w-fit">
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                SAVED POSTS
              </span>
              <span className="mt-1 text-2xl font-black text-slate-900">
                {myProfileData.bookmarksCount}
              </span>
            </div>
          </div>
        </CardBody>
      ) : (
        // show follow Btn if the user not is the userLogin
        <div className="text-end me-6 mt-5">
          <Button
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-extrabold ${followBtn ? "bg-accent1 text-primary hover:bg-primary hover:text-accent1" : "bg-primary text-accent1 hover:bg-accent1 hover:text-primary"}  transition-colors duration-300`}
            endContent={
              <div className="flex items-center justify-center gap-2">
                {!followBtn ? (
                  <>
                    <SlUserFollow className=" text-lg" />
                    Follow
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Following
                  </>
                )}
              </div>
            }
            onPress={handleFollow_UnFollow} // this handle follow / unfollow func get from props from userProfile.jsx
          />
        </div>
      )}
      {/************************ End Body of Card ************************/}
    </Card>
  );
};

export default ProfileCard;

{
  /**************************** Start from hero-ui ***********************************/
}
export const CameraIcon = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};
{
  /**************************** End from hero-ui ***********************************/
}
