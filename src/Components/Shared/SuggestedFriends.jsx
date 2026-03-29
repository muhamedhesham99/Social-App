import { useContext } from "react";
import getFollowSuggestionApi from "../../Services/Api/GetApi/getFollowSuggestionApi";
import { TokenContext } from "../../Context/TokenContext/TokenContect";
import { useQuery } from "@tanstack/react-query";
import FollowCardSkeleton from "./FollowCardSkeleton";
import FollowCard from "./FollowCard";
import { RiGroupLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const SuggestedFriends = () => {
  const { userToken } = useContext(TokenContext); // userToken

  const { data, isLoading } = useQuery({
    queryKey: ["suggestionFriends", userToken],
    queryFn: () => getFollowSuggestionApi(1, 5), // where '1' is number page and '5' is limit followers
  }); // tanStak query for handle the caching of api

  const suggestionFriends = data?.data?.data?.suggestions; // data of suggestions friends
  return (
    <>
      {isLoading ? (
        Array.from({ length: 5 }, (_, index) => (
          <FollowCardSkeleton key={index} /> // is the skeleton of follow card until the data is loaded
        ))
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/******************************** Header ***************************************/}
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiGroupLine className="text-primary" />
              <h3 className="text-base font-extrabold text-slate-900">
                Suggested Friends
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {suggestionFriends?.length}
            </span>
          </div>
          {/******************************** Body ***************************************/}
          <div className="space-y-3">
            {suggestionFriends.map((card) => {
              return <FollowCard key={card._id} card={card} />;
            })}
          </div>
          {/******************************** Footer ***************************************/}
          <button className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
            <Link to={"/suggestions"}>View more</Link>
          </button>
        </div>
      )}
    </>
  );
};

export default SuggestedFriends;
