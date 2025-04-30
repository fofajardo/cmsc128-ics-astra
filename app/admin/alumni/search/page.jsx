"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { users, alumniProfiles } from "@/components/DummyData";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import SkillTag from "@/components/SkillTag";
import { Axis3DIcon } from "lucide-react";
import axios from "axios";
import { capitalizeName } from "../../../utils/format.jsx";

export default function AlumniSearch() {
  const [showFilter, setShowFilter] = useState(false);
  const info = { title: "Registered Alumni", search: "Search for an alumni" };
  const toggleFilter = () => { setShowFilter((prev) => !prev); };

  const [alumList, updateAlumList] = useState([]);
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
    total: 999              // How many alum in db
  });
  const [searchQuery, setSearchQuery] = useState("");


  // FOR BACKEND PEEPS
  useEffect(() => {
    console.log("State updated:", {
      appliedFilters,
      pagination,
      searchQuery,
    });

    //refetch alum list
    const fetchAlumniProfiles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles`, {
          params: {
            page: pagination.currPage,
            limit: pagination.numToShow
          }
        });
        console.log("Fetched alumni:", response.data);
        if (response.data.status === "OK") {
          updateAlumList(
            response.data.list.map(

              alum => ({
                id: alum.alum_id,
                image: "https://cdn-icons-png.flaticon.com/512/145/145974.png", // TODO: Jonz pa-implement nito
                alumname: capitalizeName(`${alum.first_name} ${alum.last_name}`),
                email: alum.email,
                graduationYear: alum.year_graduated?.split("-")[0], // TODO: Jonz pa-implement nito, fetch mo yung data from degree programs
                location: alum.location,
                fieldOfWork: alum.primary_work_experience?.field || "No Position Title", // TODO: FRG pa-implement nito
                skills: alum.skills ? alum.skills.split(",") : [],
              }))
          );
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
      }
    };

    fetchAlumniProfiles();
    //update pagination

  }, [appliedFilters, pagination, searchQuery]);

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
          <Table cols={cols} data={createRows(alumList)} />
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


const mockdata = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Emma Johnson",
    email: "emma.johnson@example.com",
    graduationYear: 2015,
    location: "New York, NY",
    fieldOfWork: "Backend Development",
    skills: ["Java", "Spring Boot", "REST APIs", "PostgreSQL"]
  },
  {
    id: 2,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Liam Smith",
    email: "liam.smith@example.com",
    graduationYear: 2018,
    location: "San Francisco, CA",
    fieldOfWork: "Machine Learning Engineering",
    skills: ["Python", "Scikit-learn", "Pandas"]
  },
  {
    id: 3,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Olivia Brown",
    email: "olivia.brown@example.com",
    graduationYear: 2012,
    location: "Chicago, IL",
    fieldOfWork: "Frontend Development",
    skills: ["HTML", "CSS", "JavaScript", "Vue.js"]
  },
  {
    id: 4,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Noah Davis",
    email: "noah.davis@example.com",
    graduationYear: 2020,
    location: "Austin, TX",
    fieldOfWork: "DevOps Engineering",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"]
  },
  {
    id: 5,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Ava Wilson",
    email: "ava.wilson@example.com",
    graduationYear: 2017,
    location: "Seattle, WA",
    fieldOfWork: "Mobile App Development",
    skills: ["Swift", "iOS", "Firebase"]
  },
  {
    id: 6,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "William Martinez",
    email: "william.martinez@example.com",
    graduationYear: 2014,
    location: "Miami, FL",
    fieldOfWork: "Full Stack Development",
    skills: ["Node.js", "React", "MongoDB", "GraphQL"]
  },
  {
    id: 7,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    graduationYear: 2016,
    location: "Denver, CO",
    fieldOfWork: "Cloud Engineering",
    skills: ["Azure", "Linux", "Networking", "Python"]
  },
  {
    id: 8,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "James Anderson",
    email: "james.anderson@example.com",
    graduationYear: 2013,
    location: "Boston, MA",
    fieldOfWork: "Security Engineering",
    skills: ["Penetration Testing", "OWASP", "Metasploit"]
  },
  {
    id: 9,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Isabella Thomas",
    email: "isabella.thomas@example.com",
    graduationYear: 2019,
    location: "Los Angeles, CA",
    fieldOfWork: "AI Research",
    skills: ["PyTorch", "Deep Learning", "NLP"]
  },
  {
    id: 10,
    image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
    alumname: "Benjamin Lee",
    email: "benjamin.lee@example.com",
    graduationYear: 2011,
    location: "Atlanta, GA",
    fieldOfWork: "Database Administration",
    skills: ["SQL", "Oracle", "Database Tuning", "Shell Scripting", "PL/SQL"]
  }
];
