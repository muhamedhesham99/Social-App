import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { CiBookmark } from "react-icons/ci";
import { MdInsertPhoto, MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useContext, useRef, useState } from "react";
import { IoEarth, IoLockClosedOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { FaRegBookmark, FaRegComment } from "react-icons/fa";
import { BiShareAlt } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import TopComment from "./TopComment";
import AllComments from "./AllComments";
import CreateComment from "./CreateComment";
import putBookmark_UnbookmarkPostApi from "../../Services/Api/PutApi/putBookmark_UnbookmarkPostApi";
import putEditMyPostApi from "../../Services/Api/PutApi/putEditMyPostApi";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import { toast } from "react-toastify";
import deletePostApi from "../../Services/Api/DeleteApi/deletePostApi";
import putLike_UnLikePostApi from "../../Services/Api/PutApi/putLike_UnLikePostApi";
import postSharePostApi from "../../Services/Api/PostApi/postSharePostApi";
import SharedPost from "./SharedPost";

const Post = ({
  post: {
    body,
    bookmarked,
    commentsCount,
    createdAt: postCreatedAt,
    id, // id of the post
    image, // image of post
    isShare, //return boolean value where if post has shared previously or not where false is not shared before, where isShare is true then return or show specific card with specific styling to show the original post and the shared post in one card where show the owner of original post and the user shared post in one card
    likes: postLikes, // return the token of users where liked post
    likesCount,
    privacy,
    sharedPost, // return object has data of shared content of the post shared not the original if made share on the post, where data as body of the shared post, comments count of the shared post,....
    sharesCount,
    topComment,
    user,
  },
}) => {
  /*********************************************** Start use Hooks ***************************************************/
  const myClient = useQueryClient(); // useQueryClient of my Client
  const pathID = useParams(); // use params to get id of post
  const {
    userData: { _id: userLoginId },
  } = useContext(userContext); // userData fo user login
  const [savePost, setSavePost] = useState(bookmarked); // setState of saved icon where if the post saved then show save Btn where get value from backend throw "bookmarked"
  const [editPostBtn, setEditPostBtn] = useState(false); // for edit post to handle the input show or hidden
  const editPostRef = useRef(null); // useRef of the editPost textarea "body of post"
  const photoRef = useRef(null); // useRef of the editPost Photo
  const [saveButtonLoading, setSaveButtonLoading] = useState(false); // for edit post to handle the save btn when the data is pending or sending the value is true where the loading btn show
  const [commentBtn, setCommentBtn] = useState(false); // for comment Btn to create comment
  const [likeBtn, setLikeBtn] = useState(postLikes.includes(userLoginId)); // for like Btn where if the login user is liked the post, then the ui showing the liked react where check if postLikes has the userLoginId then return true value
  const [likes, setLikes] = useState(likesCount); // likes of post counter where can handle ui if liked post or unlike post in frontEnd
  const SharePostRef = useRef(null); // userRef of the share post textarea "body of shared post"
  const [sharingLoading, setSharingLoading] = useState(false); // Sharing loading after click on share
  /*********************************************** End use Hooks ***************************************************/

  /******************************* Start handle view image when click on it from hero-ui *********************************/
  const { isOpen, onOpen, onClose } = useDisclosure(); // deStruct functions of modal component of hero-ui for image of post to open when click on image
  /******************************* End handle view image when click on it from hero-ui *********************************/

  /******************************* Start handle Share post modal when click on Share posr Btn from hero-ui *********************************/
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onOpenChange: onOpenChangeShare,
  } = useDisclosure(); // deStruct functions of modal component of hero-ui for share Btn where open share layout when click on share Btn
  /******************************* End handle Share post modal when click on Share posr Btn from hero-ui *********************************/

  const invalidateQueries = [
    "postDetails", // post details page
    "homeAllPosts", // home All Posts page
    "feedPosts", // feed Posts page
    "myPosts", // my Posts page
    "communityPosts", // community Posts page
    "savedPosts", // saved Posts page
    "profilePosts", // my profile data as number of posts and bookmarks and following
    "myProfile", // my profile posts
  ]; // array of invalid queries where i want to revalidate or refetch it

  function timeAgo(createdPostDate) {
    const createdPostAt = new Date(createdPostDate);
    const now = new Date();
    const diff = now - createdPostAt;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    // 1000 for ms, 60 for secounds, 60 for minutes, 24 for hours
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  } // function that get time ago of post where has if-condition to show time ago as days, hours, minutes if exist

  function privacyText(privacyPost) {
    if (privacyPost === "public") return "Public";
    if (privacyPost === "following") return "Following";
    if (privacyPost === "only_me") return "Only me";
  } // update the text value of privacy where returned from backend

  async function handleSavePost() {
    setSavePost((prev) => !prev);
    const {
      data: {
        data: { bookmarked },
      },
    } = await putBookmark_UnbookmarkPostApi(id); // api call to save post as bookmark where if i click again on button, will be unsaved
    if (bookmarked) {
      toast.success(`Successfully Saved Post of ${user.name}`);
    } else {
      toast.success(`UnSaved Post of ${user.name}`);
    }
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on save post

  async function handleEditPost() {
    const formData = new FormData(); // make formData to send via api
    if (editPostRef.current.value) {
      formData.append("body", editPostRef.current.value); //append the value of textarea of post body
    }
    if (photoRef.current.files[0]) {
      formData.append("image", photoRef.current.files[0]); //append the value of photo input files of post body
    }
    setSaveButtonLoading(true); // show the loading button while the data pending or sending
    try {
      await putEditMyPostApi(id, formData); // api call to edit post
      toast.success("Successfully Edited Post");
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Please edit at least one of post body 'Photo , Content'"); // error toastify if the user don't update any field of edit post
      }
    }
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
    setEditPostBtn(false); // hide the edit post textarea and show the body of post
    setSaveButtonLoading(false); // reset the loading btn where show save button after success sending data and hide loading btn
  } // function that handle when click on Edit post

  async function handleDeletePost() {
    await deletePostApi(id); // api call to delete post
    toast.success("Successfully Deleted Post");
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on delete post

  async function handleLike_UnLikePost() {
    setLikeBtn((prev) => !prev); // setState the liked Btn view
    setLikes((count) => (likeBtn ? count - 1 : count + 1)); // setState handle the counter of likes of post where if likeBtn is true then the counter of likes when user click will decrase by 1 and the reverse is right
    await putLike_UnLikePostApi(id); // api call to like/UnLike post
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on like/UnLike post

  async function handleSharePost() {
    let sharedPostBody = ""; // declear variable of body of api call where is the body of shared post
    if (SharePostRef.current.value) {
      sharedPostBody = {
        body: SharePostRef.current.value, // the body value of shared post
      }; // body of api call where is the body of shared post
    }
    try {
      await postSharePostApi(id, sharedPostBody); //api call to Share post
      toast.success("Successfully Shared The Post"); // success toastify showing the message of success
    } catch (error) {
      toast.error(error?.response?.data?.message); // error toastify showing the message of error
    }
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on Share post

  return (
    <>
      {/********************** Start article post *******************************************/}
      <section
        id="post"
        className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm my-5"
      >
        {/*************************************** Header of Post *************************************************/}
        <div className="p-4" id="headerPost">
          <div className="flex items-center gap-3">
            {/******************** Start Image Avatar of user Post *****************************/}
            <Link className="shrink-0" to={`/profile/${user._id}`}>
              <img
                alt={user.name}
                className="h-11 w-11 rounded-full object-cover "
                src={user.photo}
              />
            </Link>
            {/******************** End Image Avatar of user Post *****************************/}
            <div className="min-w-0 flex-1">
              {/******************** Start name of user Post *****************************/}
              <Link
                className="truncate text-sm font-bold text-foreground hover:underline hover:text-primary"
                to={`/profile/${user._id}`}
              >
                {user.name}
              </Link>
              {/******************** End name of user Post *****************************/}
              {/******************** Start userName and time that post created and privacy of user Post *****************************/}
              <div className="flex flex-wrap items-center gap-1 text-xs">
                @{user.username}
                <span className="rounded px-0.5 py-0.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                  {timeAgo(postCreatedAt)}
                </span>
                <span className="mx-1">·</span>
                <span className="inline-flex items-center gap-1">
                  {privacyText(privacy) === "Public" && <IoEarth />}
                  {privacyText(privacy) === "Following" && <HiUserGroup />}
                  {privacyText(privacy) === "Only me" && (
                    <IoLockClosedOutline />
                  )}
                  {privacyText(privacy)}
                </span>
              </div>
              {/******************** End userName and time that post created and privacy of user Post *****************************/}
            </div>
            {/******************** Start three dots of user Post *****************************/}
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button variant="light" className="  h-5 ">
                  <PiDotsThreeOutlineFill />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" variant="faded">
                {/******************** Start save Btn of user Post *****************************/}
                <DropdownItem
                  key="Save"
                  startContent={<CiBookmark />}
                  onPress={handleSavePost}
                >
                  {!savePost ? "Save post" : "Unsave post"}
                </DropdownItem>
                {/******************** End save Btn of user Post *****************************/}
                {/********************  if the post belong to userLogin then show edit and delete Btn for the post *****************/}
                {user._id === userLoginId && ( // if the user login id is the same user id of the post then show "Edit Post" Btn to make edit and show "Delete Post" Btn to delete post
                  <>
                    {/******************** Start edit Btn of user Post *****************************/}
                    <DropdownItem
                      key="edit"
                      startContent={<MdOutlineModeEdit />}
                      onPress={() => setEditPostBtn(true)}
                    >
                      Edit Post
                    </DropdownItem>
                    {/******************** End edit Btn of user Post *****************************/}
                    {/******************** Start delete Btn of user Post *****************************/}
                    <DropdownItem
                      key="delete"
                      startContent={<RiDeleteBin6Line />}
                      className="text-danger"
                      color="danger"
                      onPress={handleDeletePost}
                    >
                      Delete Post
                    </DropdownItem>
                    {/******************** End delete Btn of user Post *****************************/}
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
            {/******************** End three dots of user Post *****************************/}
          </div>
          {/*************************************** Start Content of Body Post *************************************************/}
          {/******************** if userLogin click on edit Btn **************************/}
          {!editPostBtn ? ( // this is the body of the post where get from backend
            <div id="postBody" className="text-sm mt-3">
              <p className="wrap-break-word">{body}</p>
            </div>
          ) : (
            // this is the edit textarea of the body of post where show if userLogin click on "edit post" Btn
            <div className="mt-3">
              {/************************** Start TextArea input *******************/}
              <textarea
                maxLength={5000}
                className="min-h-27.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-secondary/20 focus:border-primary focus:ring-2"
                defaultValue={body}
                ref={editPostRef}
              />
              {/************************** End TextArea input *******************/}
              <div className="mt-2 flex items-center justify-between">
                <div>
                  {/************************** Start icon of upload image input *******************/}
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                    <MdInsertPhoto />
                    {/************************** Start input type files of upload image *******************/}
                    <input
                      accept="image/*"
                      className="hidden"
                      type="file"
                      ref={photoRef}
                    />
                    {/************************** End input type files of upload image *******************/}
                  </label>
                  {/************************** End icon of upload image input *******************/}
                </div>
                <div className="flex items-center justify-end gap-2">
                  {/**************************  Start Cancel Btn of Edit post *******************/}
                  <button
                    className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    onClick={() => setEditPostBtn(false)}
                  >
                    Cancel
                  </button>
                  {/**************************  End Cancel Btn of Edit post *******************/}
                  {/**************************  Start Save Btn of Edit post *******************/}
                  {!saveButtonLoading ? ( // if click on save Btn then Loading Btn will show until edited the post
                    <button
                      className="cursor-pointer rounded-full bg-accent1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-accent1 "
                      onClick={handleEditPost}
                    >
                      Save
                    </button>
                  ) : (
                    <Button
                      isLoading
                      size=""
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-accent1"
                    />
                  )}
                  {/**************************  End Save Btn of Edit post *******************/}
                </div>
              </div>
            </div>
          )}
          {/*************************************** End Content of Body Post *************************************************/}

          {/******************* Start Handle show bookmared icon if the post saved ************************/}
          {savePost && ( //show bookmared icon if the post saved
            <div className="inline-flex mt-3 items-center gap-1 rounded-full bg-accent1/70 px-2.5 py-1 text-[11px] font-bold text-primary">
              <FaRegBookmark />
              Saved
            </div>
          )}
          {/******************* End Handle show bookmared icon if the post saved ************************/}
        </div>
        {/************************* Start Image Body of Post *********************************/}
        {image && ( //if the post has image from backend then show the image but if not then hide this section
          <div
            id="bodyPost"
            className=" max-h-155 overflow-hidden border-y border-slate-200 flex items-center justify-center"
          >
            {/******************** Start Modal of image where preview if i click on image ******************/}
            <Modal
              backdrop="blur"
              isOpen={isOpen}
              onClose={onClose}
              closeButton={
                <div>
                  <RxCross2 className=" fixed top-[5%] right-[5%] text-4xl p-1 rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer" />
                </div>
              }
              classNames={{
                base: "bg-transparent w-[75%] h-[75%] max-w-none shadow-none",
                body: " p-0 overflow-auto flex items-center justify-center scrollbar-hide",
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <ModalBody>
                    <img
                      alt="post image"
                      className="rounded-2xl  object-cover "
                      src={image}
                    />
                  </ModalBody>
                )}
              </ModalContent>
            </Modal>
            {/******************** End Modal of image where preview if i click on image ******************/}
            {/******************** Start main Image of the body of post where if i click on image then preview the modal of image ******************/}
            <button
              type="button"
              className="group relative block w-full cursor-pointer"
            >
              <img
                alt="post image"
                className="w-full object-cover"
                src={image}
                onClick={() => onOpen()}
              />
              {/***************************** Start this is an transition of color that when user hover on image, the image will fade out in color */}
              <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              {/***************************** End this is an transition of color that when user hover on image, the image will fade out in color */}
            </button>
            {/******************** End main Image of the body of post where if i click on image then preview the modal of image ******************/}
          </div>
        )}
        {/************************* End Image Body of Post *********************************/}
        {/***************************** Start SharedPost Component *************************************/}
        {
          sharedPost && <SharedPost sharedPost={sharedPost} /> // if the post is Shared by any user where returned true value of sharedPost from backend then show the post where shared as a child of the main post in timeLine
        }
        {/***************************** End SharedPost Component *************************************/}
        {/*************************************** Start Footer of Post *************************************************/}
        <div id="footerPost">
          <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/***************** Start Likes Counter of post **************/}
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <AiFillLike />
                </span>
                <button
                  type="button"
                  className="font-semibold transition cursor-pointer hover:text-primary hover:underline"
                >
                  {likes} likes
                </button>
              </div>
              {/***************** End Likes Counter of post **************/}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
                {/***************** Start Shares Counter of post **************/}
                <span className="inline-flex items-center gap-1">
                  <IoIosShareAlt />
                  {sharesCount} shares
                </span>
                {/***************** End Shares Counter of post **************/}
                {/***************** Start Comments Counter of post **************/}
                <span>{commentsCount} comments</span>
                {/***************** End Comments Counter of post **************/}
                {/******************** Start view all comments Btn to show all comments **************/}
                <button className="rounded-md px-2 py-1 text-xs font-bold text-primary hover:bg-[#e7f3ff]">
                  <Link to={`/postDetails/${id}`}>View details</Link>
                </button>
                {/******************** End view all comments Btn to show all comments **************/}
              </div>
            </div>
          </div>
          <div className="mx-4 border-t border-slate-200" />
          <div className="grid grid-cols-3 gap-1 p-1">
            {/***************** Start Like Btn of post **************/}
            <button
              className={`cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm hover:bg-slate-100 ${likeBtn ? "text-primary" : "text-slate-600"}`}
              onClick={handleLike_UnLikePost}
            >
              <AiFillLike />
              <span>{likeBtn ? "Liked" : "Like"}</span>
            </button>
            {/***************** End Like Btn of post **************/}
            {/***************** Start Comment Btn of post **************/}
            <button
              className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100"
              onClick={() => setCommentBtn((prev) => !prev)}
            >
              <FaRegComment />
              <span>Comment</span>
            </button>
            {/***************** End Comment Btn of post **************/}
            {/***************** Start Share Btn of post **************/}
            {/******************** Start Modal of Share layout where preview when click on share Btn ******************/}
            <Modal
              backdrop="opaque"
              classNames={{
                backdrop:
                  "bg-linear-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                base: "w-[65%] h-[50%] max-w-none shadow-none overflow-auto",
              }}
              isOpen={isOpenShare}
              onOpenChange={onOpenChangeShare}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    {/******************** Header of Modal ******************/}
                    <ModalHeader className="flex flex-col gap-1 border-b-1 border-slate-200">
                      Share post
                    </ModalHeader>
                    {/******************** Body of Modal ******************/}
                    <ModalBody className="mb-2">
                      {/******************** Textarea input ******************/}
                      <textarea
                        type="text"
                        placeholder="Say something about this..."
                        rows="5"
                        maxLength="500"
                        className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-secondary/20"
                        ref={SharePostRef}
                      />
                      {/******************** post will share ******************/}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center gap-2">
                          <img
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover"
                            src={user.photo}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {user.name}
                            </p>
                            <p className="truncate text-xs font-semibold text-slate-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                          {body}
                        </p>
                        {image && (
                          <img
                            alt="post preview"
                            className="mt-2  w-full rounded-lg object-cover flex justify-center items-center"
                            src={image}
                          />
                        )}
                      </div>
                    </ModalBody>
                    {/******************** Footer of Modal ******************/}
                    <ModalFooter className="border-t-1 border-slate-200">
                      <Button color="primary" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      {!sharingLoading ? (
                        <Button
                          color="primary"
                          onPress={async () => {
                            setSharingLoading(true); // setSharingLoading is true to show loading button
                            await handleSharePost(); // function that handle when click on Share post
                            onClose(); // closse modal of share post
                            setSharingLoading(false); // setSharingLoading is true to show loading button
                          }}
                        >
                          Share now
                        </Button>
                      ) : (
                        <Button
                          isLoading
                          size=""
                          className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-accent1 "
                        />
                      )}
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            {/******************** End Modal of Share layout where preview when click on share Btn ******************/}
            <button
              className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100"
              onClick={() => onOpenShare()}
            >
              <BiShareAlt />
              <span>Share</span>
            </button>
            {/***************** End Share Btn of post **************/}
          </div>
          {/*************************************** Start create comment component of Post when click on create comment *************************************************/}
          {commentBtn ? ( // if click on commentBtn of the post then show CreateComment component else preview topComment
            <div className="p-5 border-t-1 border-slate-200">
              <CreateComment postId={id} setCommentBtn={setCommentBtn} />
            </div>
          ) : pathID.id ? ( // if the user in postDetails where the path of browser has id then show all comments else show top comment of post
            <AllComments postId={pathID.id} isUserProfile />
          ) : commentsCount > 0 ? ( // if comments grater than then show topComment else null
            <TopComment topComment={topComment} />
          ) : null}
          {/*************************************** End create comment component of Post when click on create comment *************************************************/}
        </div>
        {/*************************************** End Footer of Post *************************************************/}
      </section>
      {/********************** End article post *******************************************/}
    </>
  );
};

export default Post;
