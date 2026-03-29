import { Link } from "react-router-dom";

const TopComment = ({ topComment, sharedPost }) => {
  return (
    <>
      {topComment && ( // if the post has comments then show the topComment where get from backend
        <div
          className={`mx-4 mb-4 rounded-2xl border border-slate-200 ${sharedPost ? "bg-white border-none blur-[1px] hover:blur-none  hover:outline-1 hover:outline-primary/10" : "bg-slate-50"}  p-3`}
        >
          {/************************** Start headline of the topComment where if the post is SharedPost then the headline is "Top Comment Of Shared Post" */}
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
            {!sharedPost ? "Top Comment" : "Top Comment Of Shared Post"}
          </p>
          {/************************** End headline of the topComment where if the post is SharedPost then the headline is "Top Comment Of Shared Post" */}
          <div className="flex items-start gap-2">
            {/******************** Start Image of topComment User **************/}
            <img
              alt="Muhammad Elsharkawy"
              className="h-8 w-8 rounded-full object-cover"
              src={topComment.commentCreator.photo}
            />
            {/******************** End Image of topComment User **************/}
            <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2">
              {/******************** Start name of topComment User **************/}
              <p className="truncate text-xs font-bold text-slate-900">
                {topComment.commentCreator.name}
              </p>
              {/******************** End name of topComment User **************/}
              {/******************** Start content and image of comment if the comment has image of topComment User **************/}
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700 wrap-break-word">
                {topComment.content}
              </p>
              {topComment.image && ( // if the topComment has image then preview it
                <img
                  alt="Comment"
                  className="mt-2 max-h-52 w-full rounded-lg object-cover"
                  src={topComment.image}
                />
              )}
              {/******************** End content and image of comment if the comment has image of topComment User **************/}
            </div>
          </div>
          {/******************** Start view all comments Btn to show all comments **************/}
          <button className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer">
            <Link to={`/postDetails/${topComment.post}`}>
              View all comments
            </Link>
          </button>
          {/******************** End view all comments Btn to show all comments **************/}
        </div>
      )}
    </>
  );
};

export default TopComment;
