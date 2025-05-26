import { Skeleton } from "@/components/ui/skeleton";
import { GoBackButton } from "@/components/Buttons";
import { Loader2 } from "lucide-react";

export default function ProfileLoadingState() {
  return (
    <div className="p-4 bg-astradirtywhite min-h-screen">
      <div className="max-w-6xl mx-auto flex justify-between items-center my-1">
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-24" />

        {/* Loading indicator */}
        <div className="flex items-center text-astraprimary">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          <span className="font-medium text-sm">Loading profile...</span>
        </div>
      </div>

      {/* Profile header skeleton */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between bg-white border border-astralightgray rounded-xl px-6 py-4 shadow-sm gap-4">
        {/* Left section with proper responsive design */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full md:w-auto">
          {/* Avatar placeholder */}
          <div className="mx-auto sm:mx-0">
            <Skeleton className="w-18 h-18 rounded-full" />
          </div>

          {/* Name and details with responsive alignment */}
          <div className="mt-2 sm:mt-0 space-y-2 text-center sm:text-left w-full sm:w-auto">
            <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
            <div className="flex items-center justify-center sm:justify-start">
              <Skeleton className="h-4 w-4 mr-1 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Right section with proper responsive design */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 w-full md:w-auto mt-3 md:mt-0">
          <Skeleton className="hidden md:block h-6 w-24 rounded-full" />
          <Skeleton className="hidden md:block h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-full md:w-32 rounded-md" />
        </div>
      </div>

      {/* Main content skeletons */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Left column */}
        <div className="md:col-span-2 bg-white rounded-xl border border-astralightgray p-6 shadow-md">
          {/* Personal info section */}
          <div className="grid grid-cols-3 gap-y-8 text-center py-10">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>

          {/* Experience section */}
          <div className="mt-6">
            <Skeleton className="h-10 w-full rounded-t-md" />
            <div className="p-4 bg-astratintedwhite rounded-b-md space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border-l-4 border-astralight rounded pl-4">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-28 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Affiliations section */}
          <div className="mt-6">
            <Skeleton className="h-10 w-full rounded-t-md" />
            <div className="p-4 bg-astratintedwhite rounded-b-md space-y-4">
              <div className="border-l-4 border-astralight rounded pl-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Skills section */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <Skeleton className="h-5 w-32 mb-2" />
            <hr className="h-2 border-astralightgray" />
            <div className="flex gap-3 flex-wrap mt-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Interests section */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <Skeleton className="h-5 w-40 mb-2" />
            <hr className="h-2 border-astralightgray" />
            <div className="flex gap-3 flex-wrap mt-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          {/* Proof of graduation */}
          <div className="bg-white border border-astralightgray rounded-xl p-4 shadow-md">
            <Skeleton className="h-5 w-36 mb-2" />
            <hr className="h-2 border-astralightgray" />
            <Skeleton className="h-60 w-full mt-2 rounded-md" />
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-2">
            {/* <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}