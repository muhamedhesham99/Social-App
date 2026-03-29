import { Button } from "@heroui/react";
import { useContext, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { TokenContext } from "../../Context/TokenContext/TokenContect";
import { useQuery } from "@tanstack/react-query";
import getFollowSuggestionApi from "../../Services/Api/GetApi/getFollowSuggestionApi";
import { useNavigate } from "react-router-dom";
import FollowCardSkeleton from "../../Components/Shared/FollowCardSkeleton";
import { RiGroupLine } from "react-icons/ri";
import FollowCard from "../../Components/Shared/FollowCard";

const AllSuggestedFriends = () => {
  const { userToken } = useContext(TokenContext); // userToken
  const navigate = useNavigate(); // useNavigation
  const [pageFollowSuggestion, setPageFollowSuggestion] = useState(1); // number of page of followers
  const { data, isLoading } = useQuery({
    queryKey: ["suggestionAllFriends", userToken, pageFollowSuggestion],
    queryFn: () => getFollowSuggestionApi(pageFollowSuggestion, 20), // where '1' is number page from state pageFollowSuggestion and '20' is limit followers and when get view more will increase the number of pageFollowSuggestion to get the next page
  }); // tanStak query for handle the caching of api
  const suggestionAllFriends = data?.data?.data?.suggestions; // data of suggestions all friends

  function viewMoreFollowers() {
    setPageFollowSuggestion((prev) => prev + 1); // get the previous page follower number and then increase by 1 to get the next page by setState
  } // function that handle the view more followers

  return (
    <div className="w-[75%] mx-auto min-h-screen">
      {/********************************* Back Button to direct to "home" ******************************/}
      <Button
        color="primary"
        onPress={() => navigate("/home")}
        className="my-5"
      >
        <IoArrowBackOutline />
        Back
      </Button>
      {/********************************* follow card skeleton ******************************/}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
          {Array.from({ length: 20 }, (_, index) => (
            <FollowCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ">
          {/********************************* Header ******************************/}
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiGroupLine className="text-primary" />
              <h3 className="text-base font-extrabold text-slate-900">
                Suggested Friends
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {suggestionAllFriends.length}
            </span>
          </div>
          {/********************************* Body ******************************/}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {suggestionAllFriends.map((card) => {
              return <FollowCard key={card._id} card={card} />;
            })}
          </div>
          {/********************************* Footer ******************************/}
          <button
            onClick={viewMoreFollowers}
            className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            View more
          </button>
        </div>
      )}
    </div>
  );
};

export default AllSuggestedFriends;
