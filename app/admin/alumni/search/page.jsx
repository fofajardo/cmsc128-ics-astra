"use client";
import { useState, useEffect, useMemo } from "react"; // Add useMemo
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import SkillTag from "@/components/SkillTag";
import axios from "axios";
import { capitalizeName } from "@/utils/format.jsx";
import { Skeleton, CenteredSkeleton } from "@/components/ui/skeleton";

export default function AlumniSearch() {
  const [showFilter, setShowFilter] = useState(false);
  const info = { title: "Registered Alumni", search: "Search for an alumni" };
  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };
  const [loading, setLoading] = useState(true);
  const [alumList, setAlumList] = useState([]); // Filtered/sorted data for display
  const [appliedFilters, updateFilters] = useState({
    yearFrom: "",
    yearTo: "",
    location: "",
    field: "",
    skills: [],
    sortCategory: "",
    sortOrder: "asc",
  });
  const [pagination, setPagination] = useState({
    display: [1, 10],       // Displaying Alum #1 to #10
    currPage: 1,            // Current active page
    lastPage: 10,           // Last Page => total/numToShow
    numToShow: 10,          // How many alum to show
    total: 0                // How many alum in db
  });
  const [searchQuery, setSearchQuery] = useState("");
  const stableFilters = useMemo(() => appliedFilters, [JSON.stringify(appliedFilters)]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currPage: 1
    }));
  }, [searchQuery, stableFilters, pagination.numToShow]);

  useEffect(() => {
    const fetchAlumniProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles/alumni-search`,
          {
            params: {
              page: pagination.currPage,
              limit: pagination.numToShow,
              search: searchQuery,
              filters: stableFilters
            },
          }
        );

        if (response.data.status === "OK") {
          const updatedAlumList = await Promise.all(
            response.data.list.map(async (alum) => {
              const alumData = {
                id: alum.alum_id,
                alumname: capitalizeName(`${alum.first_name} ${alum.middle_name} ${alum.last_name}`),
                graduationYear: alum.year_graduated,
                location: alum.location,
                fieldOfWork:
                  alum.field || "N/A",
                skills: alum.skills ? alum.skills.split(",") : [],
                image:
                  "https://cdn-icons-png.flaticon.com/512/145/145974.png",
              };

              try {
                const photoResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/alum/${alum.alum_id}`
                );

                if (
                  photoResponse.data.status === "OK" &&
                  photoResponse.data.photo
                ) {
                  alumData.image = photoResponse.data.photo;
                }
              } catch (photoError) {
                console.log(
                  `Failed to fetch photo for alum_id ${alum.alum_id}:`,
                  photoError
                );
              }

              return alumData;
            })
          );

          const listLength = updatedAlumList.length;
          const lowerBound = listLength === 0 ? 0 : (pagination.currPage - 1) * pagination.numToShow + 1;
          const upperBound = listLength === 0 ? 0 : lowerBound + listLength - 1;

          setPagination((prev) => ({
            ...prev,
            display: [lowerBound, upperBound],
            total: response.data.total,
            lastPage: Math.ceil(response.data.total / prev.numToShow)
          }));

          setAlumList(updatedAlumList);
          setLoading(false);
        } else {
          console.error("Unexpected response:", response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        setLoading(false);
      }
    };

    fetchAlumniProfiles();
  }, [searchQuery, stableFilters, pagination.numToShow, pagination.currPage]);

  return (
    <div>
      {/* Filter Modal */}
      <div
        onClick={toggleFilter}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-all duration-100 ease-out ${showFilter ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <SearchFilter
            onClose={toggleFilter}
            initialFilters={appliedFilters}
            updateFilters={updateFilters}
          />
        </div>
      </div>

      {/* Header with background */}
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-astrawhite z-10">
          <h1 className="font-h1 text-center">Alumni Search</h1>
          <p className="font-s text-center">The ever-growing UPLB-ICS Alumni Network</p>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24">
        <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
          <TableHeader
            info={info}
            pagination={pagination}
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} />
          <Table cols={cols} data={loading ? skeletonRows : createRows(alumList)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>

    </div>
  );
}

const cols = [
  { label: "Image:label-hidden", justify: "center", visible: "all" },
  { label: "Name", justify: "start", visible: "all" },
  { label: "Graduation Year", justify: "center", visible: "md" },
  { label: "Location", justify: "center", visible: "lg" },
  { label: "Field Of Work", justify: "center", visible: "lg" },
  { label: "Skills", justify: "center", visible: "md" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

const skeletonRows = Array(10).fill({
  "Image:label-hidden": <CenteredSkeleton className="h-12 w-12 rounded-xl m-3" />,
  Name: <Skeleton className="h-4 w-40" />,
  "Graduation Year": <CenteredSkeleton className="h-4 w-24 flex justify-center" />,
  Location: <CenteredSkeleton className="h-4 w-24" />,
  "Field Of Work": <CenteredSkeleton className="h-4 w-28" />,
  Skills: <CenteredSkeleton className="h-4 w-44" />,
  "Quick Actions": <CenteredSkeleton className="h-4 w-18" />,
});

function createRows(alumList) {
  return alumList.map((alum) => ({
    "Image:label-hidden": renderAvatar(alum.image, alum.alumname),
    Name: renderName(alum.alumname, alum.email),
    "Graduation Year": renderText(alum.graduationYear),
    Location: renderText(alum.location),
    "Field Of Work": renderText(alum.fieldOfWork),
    Skills: renderSkills(alum.skills),
    "Quick Actions": renderActions(alum.id),
  }));
}

function renderAvatar(image, name) {
  return (
    <div className="flex justify-center">
      <div className="w-12 h-12 m-3">
        <img
          src={image}
          alt={`${name}'s avatar`}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
}

function renderName(name, email) {
  return (
    <div>
      <div className="font-rb">{name}</div>
      <div className="text-astradarkgray font-s">{email}</div>
    </div>
  );
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderSkills(skills) {
  const visibleSkills = skills.slice(0, 3);
  const remainingCount = skills.length - 3;

  return (
    <div className="relative group flex justify-center items-center cursor-default">
      <div className="flex flex-wrap justify-center items-center">
        {visibleSkills.map((skill, index) => (
          <SkillTag key={index} text={skill} />
        ))}
        {remainingCount > 0 && (
          <div className="size-8 flex justify-center items-center rounded-full text-xs font-medium border border-dashed text-astradarkgray bg-astratintedwhite cursor-default">
            +{remainingCount}
          </div>
        )}
      </div>

      <div className="fixed bottom-8 right-8 hidden group-hover:block bg-astratintedwhite border border-astradarkgray rounded-lg shadow-2xl p-4 z-10 max-w-xs">
        <ul className="list-disc list-inside text-astradarkgray">
          {skills.map((skill, index) => (
            <li key={index} className="text-s">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function renderActions(id) {
  return (
    <div className="flex justify-center">
      <ActionButton
        label="View"
        color="gray"
        route={`/admin/alumni/search/${id}`}
      />
    </div>
  );
}