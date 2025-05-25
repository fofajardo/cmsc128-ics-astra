import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent gradient-pulse rounded-md", className)}
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

function NameEmailSkeleton({ className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Skeleton className="h-4 w-36 mb-1" /> {/* Name (longer) */}
      <Skeleton className="h-3 w-24" />      {/* Email (shorter) */}
    </div>
  );
}

export { Skeleton, CenteredSkeleton, NameEmailSkeleton };
