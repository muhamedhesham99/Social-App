import { FaRegFaceGrin } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { MdInsertPhoto } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import postCreateCommentApi from "../../Services/Api/PostApi/postCreateCommentApi";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import { Button } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import postCreateReplyApi from "../../Services/Api/PostApi/postCreateReplyApi";

const CreateComment = ({
  postId,
  setCommentBtn,
  isReplyComment,
  commentId,
}) => {
  // destruct postId from props to use it in the api calling where it is the postId of the post i want to crate comment on it
  // destruct setCommentBtn to make the user after comment hidden the preview of create comment after success commented
  // destruct isReplyComment to make the user when make comment check if it comment as reply or comment of the main post where if the reply comment then return an api postCreateReplyApi, but if not then return postCreateCommentApi
  // destruct commentId to use in the calling api as postCreateReplyApi

  /******************************* Start Hooks *********************************/
  const myClient = useQueryClient(); // query client of project
  const commentRef = useRef(null); // useRef for reduce render of state of input onChange
  const photoRef = useRef(null); // useRef for handle the photo of comment
  const {
    userData: { photo, name },
  } = useContext(userContext); // use context to get userData
  const [preview, setPreview] = useState(null); // state for preview the photo of comment in ui when i select it

  const invalidateQueries = [
    "commentAllReplies",
    "postAllComments",
    "homeAllPosts",
    "feedPosts",
    "myPosts",
    "communityPosts",
    "savedPosts",
  ]; // array of invalid queries where i want to revalidate or refetch it

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      toast.success(data.data.message); // show success toast when created comment
      invalidateQueries.forEach((key) => {
        myClient.invalidateQueries({
          queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
        }); // live changed Comment ui which handle the comments ui after create comment
      }); // make foreach where if more than one invalidateQuery
      commentRef.current.value = ""; // reset the input create comment field where make the input value is empty after create comment
      photoRef.current.value = ""; // clear the photo of comment input
      setPreview(null); // make the preview of comment photo of ui is null to make it not showing in ui
      setCommentBtn(false); //make the create comment component hidden after created the comment
    }, // useMutation to handle create comment
    onError: (error) => {
      console.log(error?.response?.data?.message); // error message if the mutation is wrong or api fetch wrong data
    },
  }); // useMutation to handle the postCreateCommentApi

  function createComment() {
    const formData = new FormData(); // make formData to append json
    if (commentRef.current.value) {
      formData.append("content", commentRef.current.value); // append the content of the comment
    }
    if (photoRef.current.files[0]) {
      formData.append("image", photoRef.current.files[0]); // append the image of the comment
    }
    if (isReplyComment) {
      return postCreateReplyApi(postId, commentId, formData); // return postCreateReplyApi if the isReplyComment has true value where it pass from props
    }
    return postCreateCommentApi(postId, formData); // return postCreateCommentApi if the isReplyComment has false value where will create comment as main post
  } // function where handle create comment where use in Mutation where return promise when use mutate()

  function previewCommentPhoto() {
    const file = photoRef.current.files[0];
    if (!file) return "";
    setPreview(URL.createObjectURL(file));
  } // function that handle the photo of comment to preview in ui after selected it where the src of image should pass throw URL.createObjectURL() to make a path the browser underStand

  return (
    <>
      <div className="flex items-start gap-2">
        {/************************* Start user Avatar **********************/}
        <img
          alt={name}
          className="h-9 w-9 rounded-full object-cover"
          src={photo}
        />
        {/************************* End user Avatar **********************/}
        <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white">
          {/************************* Start Input of create comment **********************/}
          <input
            type="text"
            placeholder={`Comment as ${name}...`}
            className="w-full bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500"
            ref={commentRef}
          />
          {/************************* End Input of create comment **********************/}
          {/******************************** handle Input photo of create comment ******************************/}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                <MdInsertPhoto />
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  ref={photoRef}
                  onChange={previewCommentPhoto}
                />
              </label>
              {/******************************** handle emoj of create comment ******************************/}
              <button
                type="button"
                className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500"
              >
                <FaRegFaceGrin />
              </button>
            </div>
            {/******************************** handle send Btn create comment ******************************/}
            {!isPending ? ( // if the api is pending then show loading Btn
              <button
                onClick={() => mutate()}
                className="cursor-pointer rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-accent1 hover:bg-accent1 hover:text-primary transform transition duration-200 "
              >
                <IoIosSend className="text-xl cursor-pointer" />
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
      {/******************************** handle Preview photo of create comment before sending ******************************/}
      {preview && (
        <div className="relative mt-2">
          {/******************************** upload image to preview ******************************/}
          <img
            alt="Comment preview"
            className="max-h-52 w-[85%] mx-auto rounded-lg object-cover"
            src={preview}
          />
          {/******************************** Exit Btn in image to Exit and cancle the upload image before sending ******************************/}
          <Button
            className="cursor-pointer absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white"
            onPress={() => {
              setPreview(null); // make the preview of photo comment of ui is null
              photoRef.current.value = ""; // clear the input file where if the user select the same photo then will show the image in ui
            }}
            endContent={<RxCross2 size={20} />}
            size=""
          />
        </div>
      )}
    </>
  );
};

export default CreateComment;
