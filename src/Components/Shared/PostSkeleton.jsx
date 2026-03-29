import { Card, Skeleton } from "@heroui/react";

const PostSkeleton = () => {
  return (
    <Card className="space-y-5 p-4 my-4" radius="lg">
      <div className="max-w-75 w-full flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
      <Skeleton className="rounded-lg">
        <div className="h-60 rounded-lg bg-default-300" />
      </Skeleton>
      <div className="space-x-3 flex ">
        <Skeleton className="w-1/8 rounded-lg">
          <div className="h-3 w-full rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-1/6 rounded-lg">
          <div className="h-3 w-full rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-1/10 rounded-lg">
          <div className="h-3 w-full rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </Card>
  );
};

export default PostSkeleton;
