"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import SideJobCard from "@/components/jobs/view/sideJobCard";
import BigJobCard from "../../../../components/jobs/view/bigJobCard";
import SmallJobCard from "../../../../components/jobs/view/smallJobCard";
import Back from "../../../../components/jobs/view/back";

export default function JobsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobAndContent = async () => {
      console.log("Fetching job and content with id:", id);
      try {
        // Fetch job data
        const jobResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${id}`);
        // console.log("Job API Response:", jobResponse.data);

        // Fetch content data
        const contentResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);
        // console.log("Content API Response:", contentResponse.data);

        if (
          jobResponse.data.status === "OK" &&
          jobResponse.data.content &&
          contentResponse.data.status === "OK" &&
          contentResponse.data.content
        ) {
          // Normalize job data (e.g., convert expires_at to Date)
          const jobData = {
            ...jobResponse.data.content,
            expires_at: jobResponse.data.content.expires_at
              ? new Date(jobResponse.data.content.expires_at)
              : null,
          };
          setJob(jobData);
          setContent(contentResponse.data.content);
          // console.log("Normalized job data:", jobData);
          // console.log("Content data:", contentResponse.data.content);
        } else {
          setError("Job or content not found.");
        }
      } catch (error) {
        console.error("Error fetching job/content:", error.message, error.response?.status, error.response?.data);
        setError(error.response?.status === 404 ? "Job or content not found." : "Failed to fetch job data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobAndContent();
    } else {
      setError("Invalid job ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-xl">Loading job details...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-xl">{error}</div>;
  }

  return (
    <div className="py-8 bg-astratintedwhite w-full flex flex-col items-center">
      <Back />
      <div className="flex justify-between gap-y-2 flex-wrap max-w-[1250px] w-19/20">
        {
          job && content &&
            <>
              <BigJobCard job={job} content={content}/> <SideJobCard {...job}/>
            </>

        }
      </div>

      <div className="h-11" />

      {job && <SmallJobCard job={job} showApply={true} canReport={true}/>}
    </div>
  );
}