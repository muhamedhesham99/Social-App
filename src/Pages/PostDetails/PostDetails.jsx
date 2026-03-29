import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../../Components/Shared/PostSkeleton";
import Post from "../../Components/Shared/Post";
import getPostDetailsApi from "../../Services/Api/GetApi/getPostDetailsApi";
import { Button } from "@heroui/react";
import { IoArrowBackOutline } from "react-icons/io5";

const PostDetails = () => {
  const path = useParams(); // params of path
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["postDetails", path.id],
    queryFn: () => getPostDetailsApi(path.id),
  }); // tanStak query for handle the caching of api
  const postDetails = data?.data?.data?.post; // all posts of the 'home/community' path
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  }); // scroll to top of page

  return (
    <section
      id="postDetails"
      className="w-[75%] xl:w-[85%] mx-auto min-h-screen overflow-hidden"
    >
      <Button
        color="primary"
        onPress={() => navigate("/home")}
        className="mt-5"
      >
        <IoArrowBackOutline />
        Back
      </Button>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <div>
          <Post key={postDetails.id} post={postDetails} />
        </div>
      )}
    </section>
  );
};

export default PostDetails;
