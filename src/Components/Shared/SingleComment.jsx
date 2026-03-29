import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { MdInsertPhoto, MdOutlineModeEdit } from "react-icons/md";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { useContext, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import putUpdateCommentApi from "../../Services/Api/PutApi/putUpdateCommentApi";
import { toast } from "react-toastify";
import deleteCommentApi from "../../Services/Api/DeleteApi/deleteCommentApi";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import putLike_UnLikeCommentApi from "../../Services/Api/PutApi/putLike_UnLikeCommentApi";
import getCommentRepliesApi from "../../Services/Api/GetApi/getCommentRepliesApi";
import CreateComment from "./CreateComment";
import { FallingLines } from "react-loader-spinner";

const SingleComment = ({
  comment: {
    commentCreator: { name, photo, username, _id: creatorId },
    content,
    image,
    createdAt,
    likes: commentLikes,
    post: thePostId,
    repliesCount,
    _id: commentId,
  },
}) => {
  /******************************* Start handle view image when click on image of comment (from hero-ui) *********************************/
  const { isOpen, onOpen, onClose } = useDisclosure();
  /******************************* End handle view image when click on image of comment (from hero-ui) *********************************/
  /******************************* Start Hooks *********************************/
  const myClient = useQueryClient(); // useQueryClient of my Client
  const { id: postId } = useParams(); // use params to get id of post
  const {
    userData: { _id: userLoginId },
  } = useContext(userContext); // userData fo user login
  const [editComment, setEditComment] = useState(false); // useState for edit Comment Btn to show the textarea to edit comment
  const editCommentRef = useRef(null); // useRef for catch the value of textarea to edit comment
  const photoCommentRef = useRef(null); // useRef for catch the value of photo to edit comment
  const [saveButtonLoading, setSaveButtonLoading] = useState(false); // useState for show save Btn for edit Comment or loading Btn when click on the save
  const [likeBtn, setLikeBtn] = useState(commentLikes.includes(userLoginId)); // for like Btn where if the login user is liked the Comment, then the ui showing the liked react where check if the commentlikes from backend has include the userLoginId then the value of state likeBtn is true
  const [likes, setLikes] = useState(commentLikes.length); // likes of Comment counter where can handle ui if liked Comment or unlike Comment in frontEnd where get the value from backend by commentLikes.length
  const [showReply, setShowReply] = useState(false); // btn to show reply when click on it
  /************************************************ Start handle replies of single comment ************************************/
  const { data, isLoading } = useQuery({
    queryKey: ["commentAllReplies", commentId],
    queryFn: () => getCommentRepliesApi(thePostId, commentId),
    enabled: showReply, // make fetch when click on reply as showReply is true
  }); // tanStak query for handle the caching of api
  const allRepliesComments = data?.data?.data?.replies; // payload of allRepliesComments
  /************************************************* End handle replies of single comment ************************************/
  /******************************* End Hooks *********************************/

  const invalidateQueries = [
    "commentAllReplies", // all replies of comment
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

  function timeAgo(createdCommentDate) {
    // createdCommentDate get from backend
    const createdCommentAt = new Date(createdCommentDate);
    const now = new Date();
    const diff = now - createdCommentAt;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    // 1000 for ms, 60 for secounds, 60 for minutes, 24 for hours
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  } // function that get time ago of Comment where has if-condition to show time ago as days, hours, minutes if exist

  async function handleEditComment() {
    const formData = new FormData(); // make formData to send via api
    if (editCommentRef.current.value) {
      formData.append("content", editCommentRef.current.value); //append the value of textarea of Comment body
    } // if editCommentRef has value then get into scope
    if (photoCommentRef.current.files[0]) {
      formData.append("image", photoCommentRef.current.files[0]); //append the value of photo input files of Comment body
    } // if photoCommentRef has value then get into scope
    setSaveButtonLoading(true); // show the loading button while the data pending or sending
    /********************* Start try catch to handle the update comment *************************/
    try {
      await putUpdateCommentApi(postId, commentId, formData); // api call to edit Comment
      toast.success("Successfully Edited Comment");
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(
          "Please edit at least one of Comment Body => 'Photo , Content'",
        ); // error toastify if the user don't update any field of edit Comment
      } else {
        toast.error("Error or bad request"); // error toastify if the user has error rather than empty field of edit comment
      }
    }
    /********************* End try catch to handle the update comment *************************/
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
    setEditComment(false); // hide the edit Comment textarea and show the body of Comment
    setSaveButtonLoading(false); // reset the loading btn where show save button after success sending data and hide loading btn
  } // function that handle when click on Edit Comment

  async function handleDeleteComment() {
    await deleteCommentApi(postId, commentId); // api call to delete Comment
    toast.success("Successfully Deleted Comment"); // toastify for succefully delete comment
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on delete Comment

  async function handleLike_UnLikeComment() {
    setLikeBtn((prev) => !prev); // setState the liked Btn view
    setLikes((count) => (likeBtn ? count - 1 : count + 1)); // setState handle the counter of likes of Comment where if likeBtn is true then the counter of likes when user click will decrase by 1 and the reverse is right
    await putLike_UnLikeCommentApi(postId, commentId); // api call to like/UnLike Comment

    myClient.invalidateQueries({
      queryKey: ["postAllComments"], // this the query key of the query you want to refetch it due to the query is invalidate
    });
  } // function that handle when click on like/UnLike Comment

  function replyComment() {
    setShowReply((prev) => !prev);
  } // function that show replies when click on reply btn

  return (
    <>
      {!editComment ? (
        /********************************* header of comment *************************************/
        <div className="relative flex items-start gap-2">
          {/********************************* Start user avatar of comment *************************************/}
          <Link to={`/profile/${creatorId}`}>
            <img
              alt={name}
              className="mt-0.5 h-8 w-8 rounded-full object-cover "
              src={photo}
            />
          </Link>
          {/********************************* End user avatar of comment *************************************/}
          <div className="min-w-0 flex-1">
            <div className="relative inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  {/********************************* Start name of user comment *************************************/}
                  <Link to={`/profile/${creatorId}`}>
                    <p className="text-xs font-bold text-slate-900 hover:text-primary hover:underline">
                      {name}
                    </p>
                  </Link>
                  {/********************************* End name of user comment *************************************/}
                  {/********************************* Start userName of comment *************************************/}
                  <p className="text-xs text-slate-500">
                    {" "}
                    @{username} · {timeAgo(createdAt)}
                  </p>
                  {/********************************* End userName of comment *************************************/}
                </div>
              </div>
              {/********************************* Hnadle Content of comment *************************************/}
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800 wrap-break-word ">
                {content}
              </p>
              {/********************************* Hnadle Image of comment *************************************/}
              {image && ( // if the comment has image
                <>
                  {/************************* use Modal from hero-ui to preview photo when click on it *********************/}
                  {/************************* Start Modal where preview when click on the image **************/}
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
                      body: " p-0 flex items-center justify-center ",
                    }}
                    radius="md"
                  >
                    <ModalContent>
                      {(onClose) => (
                        <ModalBody>
                          <img
                            alt="Comment"
                            className="rounded-2xl max-w-full"
                            src={image}
                          />
                        </ModalBody>
                      )}
                    </ModalContent>
                  </Modal>
                  {/************************* End Modal where preview when click on the image **************/}
                  {/************************* Start image of the comment where if i click on it then preview the modal **************/}
                  <img
                    alt="Comment"
                    className="mt-2 max-h-52 w-full rounded-lg object-cover cursor-pointer "
                    src={image}
                    onClick={() => onOpen()}
                  />
                  {/************************* End image of the comment where if i click on it then preview the modal **************/}
                </>
              )}
            </div>
            {/********************************* Hnadle Footer of comment *************************************/}
            <div className="mt-1.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                {/******************************* Start Comment Time *********************/}
                <span className="text-xs font-semibold text-slate-400">
                  {timeAgo(createdAt)}
                </span>
                {/******************************* End Comment Time *********************/}
                {/******************************* Start like Btn of Comment *********************/}
                <button
                  className={`cursor-pointer text-xs font-semibold hover:underline hover:text-primary ${likeBtn ? "text-primary" : "text-slate-600"}`}
                  onClick={handleLike_UnLikeComment}
                >
                  {
                    likeBtn
                      ? `Liked (${likes})` // if liked then preview the count of likes after the string
                      : `Like ${likes > 0 ? `(${likes})` : ""}` // if like then preview count of likes if the likes greater than 0
                  }
                </button>
                {/******************************* End like Btn of Comment *********************/}
                {/******************************* Start reply Btn of Comment *********************/}
                <button
                  onClick={replyComment}
                  className="cursor-pointer text-xs font-semibold transition hover:underline  text-slate-500 hover:text-primary"
                >
                  Reply
                  {
                    repliesCount > 0 && ` (${repliesCount})` // if comment has replies then preview the count of replies after the string of reply
                  }
                </button>
                {/******************************* End reply Btn of Comment *********************/}
              </div>
              {/***************** Start three dots of comment where has edit and delete btn of the comment *****************/}
              {creatorId === userLoginId && ( // if the comment is own the userLoginId then can edit or delete the comment, but if not then the three dots will hide from comment
                <div>
                  <Dropdown backdrop="opaque">
                    <DropdownTrigger>
                      <Button variant="light" className="  h-5 ">
                        <PiDotsThreeOutlineFill />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" variant="faded">
                      {/************ Start Edit Button ***********/}
                      <DropdownItem
                        key="edit"
                        startContent={<MdOutlineModeEdit />}
                        onPress={() => setEditComment(true)}
                      >
                        Edit Comment
                      </DropdownItem>
                      {/************ End Edit Button ***********/}
                      {/************ Start Delete Button ***********/}
                      <DropdownItem
                        key="delete"
                        startContent={<RiDeleteBin6Line />}
                        className="text-danger"
                        color="danger"
                        onPress={handleDeleteComment}
                      >
                        Delete Comment
                      </DropdownItem>
                      {/************ End Delete Button ***********/}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
              {/***************** End three dots of comment where has edit and delete btn of the comment *****************/}
            </div>
            {/***************** Start if showReply is true then preview the replies of comment *****************/}
            {showReply &&
              (isLoading ? (
                <FallingLines
                  color="#7eacb5"
                  width="100"
                  visible={true}
                  ariaLabel="falling-circles-loading"
                />
              ) : (
                <div className="border-l-2 border-slate-300 ms-8">
                  <div className="ms-5 pt-5">
                    {allRepliesComments?.length > 0 && (
                      <div className="ms-5">
                        {allRepliesComments.map((reply) => (
                          <SingleComment key={reply._id} comment={reply} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ms-8 pt-5">
                    <CreateComment
                      postId={postId}
                      commentId={commentId}
                      isReplyComment
                    />
                  </div>
                </div>
              ))}
            {/***************** End if showReply is true then preview the replies of comment *****************/}
          </div>
        </div>
      ) : (
        // if click on editComment Btn of owen comment where userLoginId is the same userCommentId
        <div className="mt-3 w-[85%]">
          {/************************** TextArea input *******************/}
          <textarea
            maxLength={5000}
            className="min-h-27.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-secondary/20 focus:border-primary focus:ring-2"
            defaultValue={content}
            ref={editCommentRef}
          />
          <div className="mt-2 flex items-center justify-between">
            {/************************** Photo input upload *******************/}
            <div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                <MdInsertPhoto className="text-emerald-600" />
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  ref={photoCommentRef}
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2">
              {/**************************  Cancel Btn *******************/}
              <button
                className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                onClick={() => setEditComment(false)}
              >
                Cancel
              </button>
              {/**************************  Save Btn *******************/}
              {!saveButtonLoading ? ( // if click on save Btn then preview loading button
                <button
                  className="cursor-pointer rounded-full bg-accent1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-accent1 "
                  onClick={handleEditComment}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleComment;
