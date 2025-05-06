import ProjectDetailClient from "./projectdetailclient";
export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!id || id.length !== 36) {
    return {
      title: "Invalid Event - ICS-ASTRA",
      description: "This event link may be broken or the ID is incorrect.",
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects/${id}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.status === "OK" && data.list?.projectData?.title) {
      return {
        title: `${data.list.projectData.title} - ICS-ASTRA`,
        description:
          data.list.projectData.details?.slice(0, 150) || "Explore this project under ICS-ASTRA.",
      };
    }
  } catch (error) {
    console.error("Metadata fetch failed:", error);
  }

  return {
    title: "Project Not Found - ICS-ASTRA",
    description: "The requested project could not be found.",
  };
}


export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
