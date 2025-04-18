export default function AlumniSearch() {
    return <div>

        <div className="flex items-center justify-center">
            <div className="absolute px-8">
                <div className="font-h1 text-astrawhite z-10 text-center">Alumni Search</div>
                <div className="font-r text-astrawhite z-10 text-center">The ever-growing UPLB-ICS Alumni Network</div>
            </div>

            <img
            src="/blue-bg.png"
            alt="Background"
            className="h-64 w-full object-cover"
            />      
        </div>
        
        <div className="flex w-screen justify-center h-auto px-1 md:px-8 lg:px-12 py-8 bg-astradirtywhite">
            <TableSection />
        </div>

    </div>;
}

function TableSection() {
    return (
        <div>
            <TableHeader />
            <Table />
        </div>
    );
}

const alumniData = [
    {
      id: 1,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Emma Johnson",
      email: "emma.johnson@example.com",
      graduationYear: 2015,
      location: "New York, NY",
      fieldOfWork: "Backend Development",
      skills: ["Java", "Spring Boot", "REST APIs", "PostgreSQL"]
    },
    {
      id: 2,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Liam Smith",
      email: "liam.smith@example.com",
      graduationYear: 2018,
      location: "San Francisco, CA",
      fieldOfWork: "Machine Learning Engineering",
      skills: ["Python", "Scikit-learn", "Pandas"]
    },
    {
      id: 3,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Olivia Brown",
      email: "olivia.brown@example.com",
      graduationYear: 2012,
      location: "Chicago, IL",
      fieldOfWork: "Frontend Development",
      skills: ["HTML", "CSS", "JavaScript", "Vue.js"]
    },
    {
      id: 4,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Noah Davis",
      email: "noah.davis@example.com",
      graduationYear: 2020,
      location: "Austin, TX",
      fieldOfWork: "DevOps Engineering",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"]
    },
    {
      id: 5,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Ava Wilson",
      email: "ava.wilson@example.com",
      graduationYear: 2017,
      location: "Seattle, WA",
      fieldOfWork: "Mobile App Development",
      skills: ["Swift", "iOS", "Firebase"]
    },
    {
      id: 6,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "William Martinez",
      email: "william.martinez@example.com",
      graduationYear: 2014,
      location: "Miami, FL",
      fieldOfWork: "Full Stack Development",
      skills: ["Node.js", "React", "MongoDB", "GraphQL"]
    },
    {
      id: 7,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      graduationYear: 2016,
      location: "Denver, CO",
      fieldOfWork: "Cloud Engineering",
      skills: ["Azure", "Linux", "Networking", "Python"]
    },
    {
      id: 8,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "James Anderson",
      email: "james.anderson@example.com",
      graduationYear: 2013,
      location: "Boston, MA",
      fieldOfWork: "Security Engineering",
      skills: ["Penetration Testing", "OWASP", "Metasploit"]
    },
    {
      id: 9,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Isabella Thomas",
      email: "isabella.thomas@example.com",
      graduationYear: 2019,
      location: "Los Angeles, CA",
      fieldOfWork: "AI Research",
      skills: ["PyTorch", "Deep Learning", "NLP"]
    },
    {
      id: 10,
      image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
      alumniName: "Benjamin Lee",
      email: "benjamin.lee@example.com",
      graduationYear: 2011,
      location: "Atlanta, GA",
      fieldOfWork: "Database Administration",
      skills: ["SQL", "Oracle", "Database Tuning", "Shell Scripting", "PL/SQL"]
    }
  ];
  

const cols = [
    { name: '', hide: '' },
    { name: 'Name', hide: '' },
    { name: 'Graduation Year', hide: 'md' },
    { name: 'Location', hide: 'lg' },
    { name: 'Field Of Work', hide: 'lg' },
    { name: 'Skills', hide: 'md' },
    { name: 'Quick Actions', hide: '' },
  ];
  
const getResponsiveClass = (hide) => {
    if (hide === 'md') return 'hidden md:table-cell';
    if (hide === 'lg') return 'hidden lg:table-cell';
    return '';
};
  

function TableHeader() {
    return (
        <div className="flex items-center">
        <div className="font-rb px-4 py-4 h-full bg-astradark rounded-tl-xl text-astrawhite">
            Registered Alumni
        </div>
        <div className="font-r px-4 py-4 h-full bg-astrawhite rounded-tr-xl text-astradarkgray">
            Displaying entries <span className="font-rb">1-10</span> of <span className="font-rb">{alumniData.length}</span>
        </div>
        <div className="flex-grow">
        </div>
        </div>
    );
}

  
function Table() {
    return (
        <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead className="bg-astratintedwhite">
            <tr>
                {cols.map((col) => (
                <th
                    key={col.name}
                    className={`font-s font-normal text-astraprimary px-4 py-4 text-start ${getResponsiveClass(col.hide)}`}
                >
                    {col.name}
                </th>
                ))}
            </tr>
            </thead>
            <TableBody />
        </table>
        </div>
    );
}
  
function TableBody() {
    return (
        <tbody>
        {alumniData.map((alumni, idx) => (
            <tr key={idx} className="bg-astrawhite">
            {cols.map((col) => {
                let content;

                switch (col.name) {
                case '':
                    content = (
                        <div className="w-12 h-12">
                          <img
                            src={alumni.image}
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      );
                    break;
                case 'Name':
                    content = <div>
                                <div className="font-rb">{alumni.alumniName}</div>
                                <div className="font-s text-astradarkgray">{alumni.email}</div>
                            </div>
                    break;
                case 'Graduation Year':
                    content = <div className="font-s text-astrablack">{alumni.graduationYear}</div>
                    break;
                case 'Location':
                    content = <div className="font-s text-astrablack">{alumni.location}</div>
                    break;
                case 'Field Of Work':
                    content = <div className="font-s text-astrablack">{alumni.fieldOfWork}</div>
                    break;
                case 'Skills':
                    content = (
                        <div className="flex flex-wrap gap-1">
                        {alumni.skills.slice(0, 3).map((skill, i) => (
                            <span
                            key={i}
                            className="bg-astragray hy text-astradarkgray font-s px-2 py-1 rounded-full"
                            >
                            {skill}
                            </span>
                        ))}
                        {alumni.skills.length > 3 && (
                            <span className="text-astradarkgray font-s">...</span>
                        )}
                        </div>
                    );
                    break;

                case 'Quick Actions':
                    content = (
                        <div className="flex gap-2 justify-center">
                        <button className="style-button font-sb bg-astratintedwhite hover:bg-astragray text-astraprimary">
                          View
                        </button>
                      </div>
                      
                    );
                    break;
                default:
                    content = null;
                }

                return (
                <td
                    key={col.name}
                    className={`px-4 py-3 border-b border-astragray ${getResponsiveClass(col.hide)}`}
                >
                    {content}
                </td>
                );
            })}
            </tr>
        ))}
        </tbody>
    );
}



  
