import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDisclosure, Modal, ModalContent, ModalBody } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { AiFillLike } from "react-icons/ai";
import { IoIosShareAlt } from "react-icons/io";
import TopComment from "./TopComment";

const SharedPost = ({
  sharedPost: {
    body,
    commentsCount,
    createdAt,
    id,
    image,
    likesCount,
    sharesCount,
    topComment,
    user,
  },
}) => {
  /******************************* Start handle view image when click on it from hero-ui *********************************/
  const { isOpen, onOpen, onClose } = useDisclosure(); // deStruct functions of modal component of hero-ui for image of post to open when click on image
  /******************************* End handle view image when click on it from hero-ui *********************************/

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

  return (
    <div className="mx-4 my-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="p-3">
        {/*************************************** Header of Post *************************************************/}
        <div className="mb-2 flex items-center gap-2">
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
            {/******************** Start userName and time that post created *****************************/}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              @{user.username}
              <span className="rounded px-0.5 py-0.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                {timeAgo(createdAt)}
              </span>
            </div>
            {/******************** End userName and time that post created *****************************/}
          </div>
          {/******************** Start Link go to the original post of the shared post *****************************/}
          <Link to={`/postDetails/${id}`}>
            <button className=" cursor-pointer ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-primary hover:underline">
              Original Post
              <FaExternalLinkAlt />
            </button>
          </Link>
          {/******************** End Link go to the original post of the shared post *****************************/}
        </div>
        {/*************************************** Start Content of Body Post *************************************************/}
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 wrap-break-word">
          {body}
        </p>
        {/*************************************** End Content of Body Post *************************************************/}
      </div>
      {/************************* Start Image Body of Post *******************************/}
      {image && ( //if the post has image from backend then show the image but if not then hide this section
        <div
          id="bodyPost"
          className="max-h-155 overflow-hidden border-y border-slate-200 flex items-center justify-center"
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
      {/***************************** Start Footer Of SharedPost *******************************/}
      <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/***************** Start Likes of SharedPost **************/}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <AiFillLike />
            </span>
            <button
              type="button"
              className="font-semibold transition cursor-pointer hover:text-primary hover:underline"
            >
              {likesCount} likes
            </button>
          </div>
          {/***************** End Likes of SharedPost **************/}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            {/***************** Start Shares of SharedPost **************/}
            <span className="inline-flex items-center gap-1">
              <IoIosShareAlt />
              {sharesCount} shares
            </span>
            {/***************** End Shares of SharedPost **************/}
            {/***************** Start Comments of SharedPost **************/}
            <span>{commentsCount} comments</span>
            {/***************** End Comments of SharedPost **************/}
          </div>
        </div>
      </div>
      {/***************************** End Footer Of SharedPost *******************************/}
      {/***************************** Start topComment of SharedPost *******************************/}
      <div>
        {/****************** if the post is shared then pass the Bolean value to TopComment component to handle the topComment data of SharedPost */}
        <TopComment topComment={topComment} sharedPost />
      </div>
      {/***************************** End topComment of SharedPost *******************************/}
    </div>
  );
};

export default SharedPost;
