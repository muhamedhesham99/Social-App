import { Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { SlUserFollow } from "react-icons/sl";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import putFollow_UnfollowUserApi from "../../Services/Api/PutApi/putFollow_UnfollowUserApi";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

const FollowCard = ({
  card: { name, username, photo, followersCount, _id },
}) => {
  /******************************* Start Hooks *********************************/
  const myClient = useQueryClient(); // query client of project
  const invalidateQueries = ["suggestionFriends", "suggestionAllFriends"]; // array of invalid queries where i want to revalidate or refetch it
  const [isFollowed, setIsFollowed] = useState(false); // btn to handle follow ui view when click follow
  /******************************* End Hooks *********************************/

  async function handleFollow_UnFollow() {
    setIsFollowed((prev) => !prev);
    const payload = await putFollow_UnfollowUserApi(_id); // api call to Follow/UnFollow
    if (payload.data.data.following) {
      toast.success(`You followed ${name}`);
    } else {
      toast.success(`Unfollow ${name}`);
    }
    invalidateQueries.forEach((key) => {
      myClient.invalidateQueries({
        queryKey: [key], // this the query key of the query you want to refetch it due to the query is invalidate
      });
    });
  } // function that handle when click on Follow/UnFollow Btn

  return (
    <div className="rounded-xl border border-slate-200 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
        >
          {/********************************* Start user avatar *************************************/}

          <Link to={`/profile/${_id}`}>
            <img
              alt={name}
              className="h-10 w-10 rounded-full object-cover"
              src={photo}
            />
          </Link>
          {/********************************* End user avatar *************************************/}
          {/********************************* Start name and userName *************************************/}
          <div className="min-w-0">
            <Link to={`/profile/${_id}`}>
              <p className="truncate text-sm font-bold text-slate-900 hover:underline hover:text-primary">
                {name}
              </p>
            </Link>
            <p className="truncate text-xs text-slate-500">@{username}</p>
          </div>
          {/********************************* End name and userName *************************************/}
        </button>
        {/********************************* Start Follow and UnFollow Btn *************************************/}
        <div className="text-end me-6 mt-5">
          <Button
            type="button"
            className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${!isFollowed ? "bg-accent1 text-primary hover:bg-primary hover:text-accent1" : "bg-primary text-accent1 hover:bg-accent1 hover:text-primary"}  transition-colors duration-300`}
            endContent={
              <div className="flex items-center justify-center gap-2">
                {!isFollowed ? (
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
            onPress={handleFollow_UnFollow}
          />
        </div>
        {/********************************* End Follow and UnFollow Btn *************************************/}
      </div>
      {/********************************* Start Followers Count *************************************/}
      <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-0.5">
          {followersCount} followers
        </span>
      </div>
      {/********************************* End Followers Count *************************************/}
    </div>
  );
};

export default FollowCard;
