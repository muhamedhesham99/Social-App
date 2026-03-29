import { useQuery } from "@tanstack/react-query";
import getPostCommentsApi from "../../Services/Api/GetApi/getPostCommentsApi";
import SingleComment from "./SingleComment";
import FollowCardSkeleton from "./FollowCardSkeleton";
import CreateComment from "./CreateComment";

const AllComments = ({ postId }) => {
  const { data } = useQuery({
    queryKey: ["postAllComments", postId],
    queryFn: () => getPostCommentsApi(postId),
  }); // tanStak query for handle the caching of api
  const allComments = data?.data?.data?.comments; // payload get all Comments
  return (
    <>
      {/************************ handle the skeleton of comment *******************************/}
      {!allComments ? ( // skeleton where view until the payload return
        Array.from(
          // use Array.from() to make array from target length where this func get mapFunc as a second parameter where return nodeElement as map()
          { length: 3 },
          (_, index) => (
            <div key={index} className="flex items-center">
              <FollowCardSkeleton />
            </div>
          ),
        )
      ) : (
        /******************************** header of comments component **************************/
        <div className="border-t border-slate-200 bg-[#f7f8fa] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-extrabold tracking-wide text-slate-700">
                Comments
              </p>
              <span className="rounded-full bg-[#e7f3ff] px-2 py-0.5 text-[11px] font-bold text-[#1877f2]">
                {allComments?.length}
              </span>
            </div>
            <select className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:bg-white focus:ring-2">
              <option value="relevant">Most relevant</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          {/******************************** Single comment component **************************/}
          <div className="space-y-2">
            {allComments.map((comment, index) => (
              <SingleComment key={allComments[index]._id} comment={comment} />
            ))}
          </div>
            {/******************************** Create comment component **************************/}
          <div className="mt-3">
            <CreateComment postId={postId} />
          </div>
        </div>
      )}
    </>
  );
};

export default AllComments;
