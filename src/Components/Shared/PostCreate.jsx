import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Textarea,
  Button,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import DropDown from "./DropDown";
import { MdInsertPhoto } from "react-icons/md";
import { FaRegFaceGrin } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postCreatePostApi from "../../Services/Api/PostApi/postCreatePostApi";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const PostCreate = () => {
  /*********************************************** Start use Hooks ***************************************************/
  const {
    userData: { photo, name },
  } = useContext(userContext); // get userData after login
  const myClient = useQueryClient(); // useQueryClient of my Client
  const photoRef = useRef(null); // useRef for handle the photo of CreatePost
  const [preview, setPreview] = useState(null); // state for preview the photo of createPost in ui when i select it
  const [postBody, setPostBody] = useState(""); // is the body of create post where will post
  const [showEmoji, setShowEmoji] = useState(false); // emojis for createPost where when click on emoji Btn then preview the list of emojis
  const navigate = useNavigate();
  const invalidateQueries = [
    "feedPosts", // feed Posts page
    "myPosts", // my Posts page
    "communityPosts", // community Posts page
  ]; // array of invalid queries where i want to revalidate or refetch it
  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      toast.success(data.data.message); // show success toast when created Post
      navigate("/home/myposts");
      setPostBody(""); // reset the input create post field where make the input value is empty after create post
      setShowEmoji(false); // hide the list of emojis
      photoRef.current.value = ""; // clear the photo of post input
      setPreview(null); // make the preview of post photo of ui is null to make it not showing in ui
      invalidateQueries.forEach((key) => {
        myClient.invalidateQueries({
          queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
        });
      });
    }, // useMutation to handle create post
    onError: (error) => {
      console.log(error?.response?.data?.message); // error message if the mutation is wrong or api fetch wrong data
    },
  }); // useMutation to handle the postCreatePostApi
  /*********************************************** End use Hooks ***************************************************/

  function createPost() {
    const formData = new FormData(); // make formData to append json
    if (postBody) {
      formData.append("body", postBody); // append the content of the createPost
    }
    if (photoRef.current.files[0]) {
      formData.append("image", photoRef.current.files[0]); // append the image of the createPost
    }
    return postCreatePostApi(formData); // return api
  } // function where handle create Post where use in Mutation where return promise when use mutate()

  function previewCreatePostPhoto() {
    const file = photoRef.current.files[0];
    if (!file) return "";
    setPreview(URL.createObjectURL(file));
  } // function that handle the photo of createPost to preview in ui after selected it

  function previewEmojiInTextarea(emojiData) {
    setPostBody((prev) => prev + emojiData.emoji);
  } // function that handle the emoji of create post in textarea

  return (
    <div className="relative">
      <Card className="flex flex-col">
        {/******************* Start Header Of Create Post **********************/}
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src={photo}
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md font-bold">{name}</p>
            <DropDown /> {/**** this is the privacy dropDown of post */}
          </div>
        </CardHeader>
        {/******************* End Header Of Create Post **********************/}
        {/******************* Start Body Of Create Post **********************/}
        <CardBody>
          <Textarea
            placeholder={`What's on your mind, ${name?.split(" ")[0]}?`}
            rows={4}
            className="border-b-3 border-gray-300 pb-3"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          />
          {preview && ( // preview selected image what the user will upload before create the post
            <div className="relative mt-2">
              <img
                alt="Post preview"
                className="max-h-52 w-[85%] mx-auto rounded-lg object-cover"
                src={preview}
              />
              {/******************* Button where cancle the image before upload it */}
              <Button
                className="cursor-pointer absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white"
                onPress={() => {
                  setPreview(null); // make the preview of photo Post of ui is null
                  photoRef.current.value = ""; // clear the input file where if the user select the same photo then will show the image in ui
                }}
                endContent={<RxCross2 size={20} />}
                size=""
              />
            </div>
          )}
        </CardBody>
        {/******************* End Body Of Create Post **********************/}
        {/******************* Start Footer Of Create Post **********************/}
        <CardFooter className="flex justify-between items-center">
          <div className="flex gap-3">
            {/**************** Start Upload Photo Btn ****************/}
            <Button
              className="bg-transparent hover:bg-gray-200"
              onPress={() => photoRef.current.click()}
            >
              <input
                accept="image/*"
                className="hidden"
                type="file"
                ref={photoRef}
                onChange={previewCreatePostPhoto}
              />
              <MdInsertPhoto className="text-emerald-600" />
              Photo/video
            </Button>
            {/**************** End Upload Photo Btn ****************/}
            {/**************** Start Emoji Btn ****************/}
            <Button
              className="bg-transparent  hover:bg-gray-200"
              onPress={
                () => setShowEmoji((prev) => !prev) // show the list of emojis
              }
            >
              <FaRegFaceGrin className="text-amber-500" />
              Feeling/activity
            </Button>
          </div>

          {/**************** End Emoji Btn ****************/}
          {!isPending ? (
            <Button
              className="bg-primary text-accent1 hover:opacity-5"
              onPress={() => mutate()}
            >
              Post
              <IoIosSend />
            </Button>
          ) : (
            <Button
              isLoading
              size=""
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-accent1"
            />
          )}
        </CardFooter>
        {/******************* End Footer Of Create Post **********************/}
      </Card>
      {/**************** Start handle Emoji Btn when click on it ****************/}
      {showEmoji && ( // if showEmoji is true then show the list of emojis
        <div className="absolute top-full left-[20%] z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => previewEmojiInTextarea(emojiData)}
            emojiStyle="facebook"
            width={300}
            height={400}
          />
        </div>
      )}
      {/**************** End handle Emoji Btn when click on it ****************/}
    </div>
  );
};

export default PostCreate;
