import JobDetailClient from "./viewjobdetailclient";

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!id || id.length !== 36) {
    return {
      title: "Invalid Event - ICS-ASTRA",
      description: "This event link may be broken or the ID is incorrect.",
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`, {
      cache: "no-store",
    });
    const data = await response.json();

    if (data.status === "OK" && data.content) {
      return {
        title: `${data.content.title} - ICS-ASTRA`,
        description:
          data.content.details?.slice(0, 150) ||
          "View full details for this ICS-ASTRA event.",
      };
    }
  } catch (error) {
    console.error("Metadata fetch failed:", error);
  }

  return {
    title: "Event Not Found - ICS-ASTRA",
    description: "The requested event could not be found.",
  };
}

export default function JobDetailLayout() {
  return <JobDetailClient />;
}