import { Skeleton } from "@heroui/react";

const FollowCardSkeleton = () => {
  return (
    <div className=" bg-white mb-5 rounded-2xl p-5">
      <div className=" w-full flex items-center mb-3">
        <div className="w-1/5">
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-3/5 flex flex-col gap-2 ms-3">
          <Skeleton className="h-3 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-2/4 rounded-lg" />
        </div>
        <div className="w-1/5">
          <Skeleton className="h-3 w-full rounded-lg" />
        </div>
      </div>
      <div>
        <Skeleton className="h-3 w-1/5 rounded-lg" />
      </div>
    </div>
  );
};

export default FollowCardSkeleton;
