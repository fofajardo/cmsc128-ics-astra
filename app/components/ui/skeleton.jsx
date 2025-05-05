import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

function CenteredSkeleton({ className }) {
  return (
    <div className="flex justify-center">
      <Skeleton className={className} />
    </div>
  );
}

export { Skeleton, CenteredSkeleton };
