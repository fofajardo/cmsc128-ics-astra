const jobTypeMap = {"0": "Part-Time", "1": "Full-time", "2": "Temporary", "3": "Freelance"};
const locationTypeMap = {"0": "Onsite", "1": "Remote", "2": "Hybrid"};

const filters = [
  {id:0, type:"dropdown", label:"Job Type" , icon:"lucide:chevron-down", placeholder:""},
  {id:1, type:"dropdown", label:"Status" , icon:"lucide:chevron-down", placeholder:""},
  {id:2, type:"text", label:"Location" , icon:"", placeholder:"City/Country"},
  {id:3, type:"dropdown", label:"Location Type" , icon:"lucide:chevron-down", placeholder:""},
  {id:4, type:"range", label:"Salary Range (₱)" , icon:"", placeholder:""},
  {id:5, type:"filter", label:"Most Recent" , icon:"lucide:list-filter", placeholder:""}
];

const jobTypeOptions = [
  {value: "", label: "All"},
  {value: 0, label: "Part-Time"},
  {value: 1, label: "Full-Time"},
  {value: 2, label: "Temporary"},
  {value: 3, label: "Freelance"}
];

const statusOptions = [
  {value: "", label: "All"},
  {value: 1, label: "Open"},
  {value: 3, label: "Closed"}
];

const locationTypeOptions = [
  {value: "", label: "All"},
  {value: 0, label: "Onsite"},
  {value: 1, label: "Remote"},
  {value: 2, label: "Hybrid"}
];

export {jobTypeMap, locationTypeMap, filters, jobTypeOptions, statusOptions, locationTypeOptions};