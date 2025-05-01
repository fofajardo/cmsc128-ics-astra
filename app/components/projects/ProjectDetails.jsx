"use client";
import { Goal, Calendar } from "lucide-react";

export default function ProjectDetails({ project }) {
  return (
    <div className="lg:col-span-2 bg-astrawhite p-6 rounded-xl shadow">
      <h2 className="font-lb text-xl mb-4">Project Details</h2>
      <p className="text-astradarkgray text-justify mb-6">{project.longDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex gap-2 items-start">
          <Goal className="w-8 h-8 text-astraprimary mt-1" />
          <div>
            <p className="font-sb">Funding Goal</p>
            <p className="text-astradarkgray">{project.goal}</p>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <Calendar className="w-8 h-8 text-astraprimary mt-1" />
          <div>
            <p className="font-sb">Project Duration</p>
            <p className="text-astradarkgray">
              {new Date(project.proposedStartDate).toLocaleDateString("en-PH")} to{" "}
              {new Date(project.proposedEndDate).toLocaleDateString("en-PH")}
            </p>
          </div>
        </div>
      </div>

      {project.type === "Scholarship" && (
        <>
          <h3 className="font-sb text-lg">Eligibility Criteria</h3>
          <p className="text-astradarkgray mb-4">{project.eligibilityCriteria}</p>

          <h3 className="font-sb text-lg">Fund Distribution</h3>
          <p className="text-astradarkgray">{project.fundDistribution}</p>
        </>
      )}

      {project.type === "Fundraiser" && (
        <>
          <h3 className="font-sb text-lg">Fund Utilization</h3>
          <p className="text-astradarkgray">{project.fundDistribution}</p>
        </>
      )}
    </div>
  );
}
