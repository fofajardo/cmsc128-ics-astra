"use client";
import { useState } from "react";
import { TableHeader, Table, PageTool } from "@/components/TableBuilder";
import { ActionButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
import { Eye, Mail } from "lucide-react";
import Link from "next/link";

export default function Contributors() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [tempSelectedProject, setTempSelectedProject] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");

  // Information for the table header
  const [info, setInfo] = useState({
    title: "Project Contributors",
    search: "Search for a contributor",
  });

  // Toggle filter modal
  const toggleFilter = () => {
    setTempSelectedProject(selectedProject); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    display: [1, 10],
    currPage: 1,
    lastPage: 3,
    numToShow: 10,
    total: 258,
    itemsPerPage: 10
  });

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchInput) => {
    setSearchQuery(searchInput);
    // Logic for filtering contributors by search query
    setPagination(prev => ({
      ...prev,
      currPage: 1,
      display: [1, prev.numToShow]
    }));
  };

  // Filter contributors by project
  const filteredContributors =
    selectedProject === "All"
      ? contributorsData
      : contributorsData.filter((contributor) => contributor.project === selectedProject);

  // Get current page contributors
  const currentContributors = filteredContributors.slice(
    (pagination.currPage - 1) * pagination.itemsPerPage,
    pagination.currPage * pagination.itemsPerPage
  );

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-astrawhite p-8 rounded-xl w-80"
          >
            <h3 className="font-lb text-xl mb-4">Filter Contributors</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-s text-astradarkgray mb-2 block">
                  Project
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg"
                  value={tempSelectedProject}
                  onChange={(e) => setTempSelectedProject(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  {Array.from(new Set(contributorsData.map(c => c.project))).map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button className="gray-button" onClick={toggleFilter}>
                  Cancel
                </button>
                <button
                  className="blue-button"
                  onClick={() => {
                    setSelectedProject(tempSelectedProject); // apply the filter
                    setPagination((prev) => ({
                      ...prev,
                      currPage: 1,
                      display: [1, prev.numToShow],
                    }));
                    toggleFilter();
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with background */}
      <div className="relative">
        <img
          src="/blue-bg.png"
          alt="Background"
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-astrawhite z-20">
          <div className="text-center">
            <h1 className="font-h1">Contributors</h1>
            <p className="font-s mt-2">Community members supporting our projects</p>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className="flex flex-col py-4 px-1 md:px-4 lg:px-8">
          <TableHeader
            info={info}
            pagination={pagination}
            setPagination={setPagination}
            toggleFilter={toggleFilter}
            setSearchQuery={handleSearch}
            searchQuery={searchQuery}
          />
          <Table cols={cols} data={createRows(currentContributors, selectedIds, setSelectedIds, setToast)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
      </div>
    </div>
  );
}

// Table columns definition
const cols = [
  { label: "Name", justify: "start", visible: "all" },
  { label: "Email", justify: "center", visible: "md" },
  { label: "Project", justify: "center", visible: "lg" },
  { label: "Donation", justify: "center", visible: "sm" },
  { label: "Date", justify: "center", visible: "lg" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

// Function to create table rows
function createRows(contributors, selectedIds, setSelectedIds, setToast) {
  return contributors.map((contributor) => ({
    "Name": renderName(contributor.name),
    "Email": renderText(contributor.email),
    "Project": renderText(contributor.project),
    "Donation": renderAmount(contributor.amount),
    "Date": renderText(contributor.date),
    "Quick Actions": renderActions(contributor.id, contributor.name, contributor.email, setToast),
  }));
}

// Helper functions for rendering table cells
function renderName(name) {
  return (
    <div className="font-s font-semibold py-5 pl-2">{name}</div>
  );
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderAmount(amount) {
  return <div className="text-center text-astragreen font-s font-semibold">{amount}</div>;
}

function renderActions(id, name, email, setToast) {
  const handleSendEmail = () => {
    // Logic for sending email
    setToast({
      type: "success",
      message: `Email sent to ${name}`
    });
  };

  return (
    <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
      <div className="hidden md:block">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/contributors/${id}`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Eye size={20}/>}
          color="gray"
          route={`/admin/contributors/${id}`}
        />
      </div>
      <div className="hidden md:block">
        <ActionButton
          label="Contact"
          color="blue"
          onClick={handleSendEmail}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Mail size={20}/>}
          color="blue"
          onClick={handleSendEmail}
        />
      </div>
    </div>
  );
}

// Sample contributor data
const contributorsData = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    project: "Computer Science Scholarship Fund",
    amount: "₱25,000",
    date: "2025-01-15"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@example.com",
    project: "Programming Lab Equipment Drive",
    amount: "₱15,000",
    date: "2025-01-18"
  },
  {
    id: 3,
    name: "Roberto Lim",
    email: "roberto.lim@example.com",
    project: "ICS Building Renovation Fund",
    amount: "₱50,000",
    date: "2025-01-20"
  },
  {
    id: 4,
    name: "Ana Reyes",
    email: "ana.reyes@example.com",
    project: "CS Library Enhancement Fund",
    amount: "₱10,000",
    date: "2025-01-22"
  },
  {
    id: 5,
    name: "Carlos Gonzales",
    email: "carlos.gonzales@example.com",
    project: "Computer Science Scholarship Fund",
    amount: "₱30,000",
    date: "2025-01-25"
  },
  {
    id: 6,
    name: "Sofia Mendoza",
    email: "sofia.mendoza@example.com",
    project: "Hackathon Sponsorship Fund",
    amount: "₱5,000",
    date: "2025-01-27"
  },
  {
    id: 7,
    name: "Miguel Tan",
    email: "miguel.tan@example.com",
    project: "International Exchange Scholarship",
    amount: "₱20,000",
    date: "2025-01-30"
  },
  {
    id: 8,
    name: "Elena Garcia",
    email: "elena.garcia@example.com",
    project: "IT Career Conference Fund",
    amount: "₱8,000",
    date: "2025-02-01"
  },
  {
    id: 9,
    name: "Pedro Aquino",
    email: "pedro.aquino@example.com",
    project: "Alumni Network Infrastructure Fund",
    amount: "₱12,000",
    date: "2025-02-03"
  },
  {
    id: 10,
    name: "Lucia Diaz",
    email: "lucia.diaz@example.com",
    project: "Computer Science Scholarship Fund",
    amount: "₱18,000",
    date: "2025-02-05"
  },
  {
    id: 11,
    name: "Antonio Castro",
    email: "antonio.castro@example.com",
    project: "Programming Lab Equipment Drive",
    amount: "₱22,000",
    date: "2025-02-07"
  },
  {
    id: 12,
    name: "Isabella Santiago",
    email: "isabella.santiago@example.com",
    project: "ICS Building Renovation Fund",
    amount: "₱35,000",
    date: "2025-02-10"
  },
  {
    id: 13,
    name: "Gabriel Ramos",
    email: "gabriel.ramos@example.com",
    project: "CS Library Enhancement Fund",
    amount: "₱7,500",
    date: "2025-02-12"
  },
  {
    id: 14,
    name: "Camila Bautista",
    email: "camila.bautista@example.com",
    project: "Hackathon Sponsorship Fund",
    amount: "₱10,000",
    date: "2025-02-15"
  },
  {
    id: 15,
    name: "Alejandro Torres",
    email: "alejandro.torres@example.com",
    project: "International Exchange Scholarship",
    amount: "₱15,000",
    date: "2025-02-18"
  },
  {
    id: 16,
    name: "Valentina Cruz",
    email: "valentina.cruz@example.com",
    project: "IT Career Conference Fund",
    amount: "₱9,000",
    date: "2025-02-20"
  },
  {
    id: 17,
    name: "Samuel Pascual",
    email: "samuel.pascual@example.com",
    project: "Alumni Network Infrastructure Fund",
    amount: "₱11,000",
    date: "2025-02-22"
  },
  {
    id: 18,
    name: "Olivia Fernandez",
    email: "olivia.fernandez@example.com",
    project: "Computer Science Scholarship Fund",
    amount: "₱20,000",
    date: "2025-02-25"
  },
  {
    id: 19,
    name: "David Marquez",
    email: "david.marquez@example.com",
    project: "Programming Lab Equipment Drive",
    amount: "₱18,000",
    date: "2025-02-28"
  },
  {
    id: 20,
    name: "Sophia Reyes",
    email: "sophia.reyes@example.com",
    project: "ICS Building Renovation Fund",
    amount: "₱25,000",
    date: "2025-03-02"
  },
  {
    id: 21,
    name: "Mateo Luna",
    email: "mateo.luna@example.com",
    project: "CS Library Enhancement Fund",
    amount: "₱8,500",
    date: "2025-03-05"
  },
  {
    id: 22,
    name: "Victoria Gomez",
    email: "victoria.gomez@example.com",
    project: "Hackathon Sponsorship Fund",
    amount: "₱6,000",
    date: "2025-03-08"
  },
  {
    id: 23,
    name: "Javier Flores",
    email: "javier.flores@example.com",
    project: "International Exchange Scholarship",
    amount: "₱17,000",
    date: "2025-03-10"
  },
  {
    id: 24,
    name: "Aurora Santos",
    email: "aurora.santos@example.com",
    project: "Computer Science Scholarship Fund",
    amount: "₱15,000",
    date: "2025-03-12"
  },
  {
    id: 25,
    name: "Benjamin Rivera",
    email: "benjamin.rivera@example.com",
    project: "Alumni Network Infrastructure Fund",
    amount: "₱10,000",
    date: "2025-03-15"
  }
];