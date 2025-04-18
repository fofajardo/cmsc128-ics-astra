import TableBuilder from '../../../components/TableBuilder';

export default function AlumniSearch() {

    const info = {title: "Registered Alumni", search:"Search for an alumni"}

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
        
        <div className="bg-astradirtywhite w-full px-1 py-4 md:px-4 lg:px-16">
            <TableBuilder info={info} cols={cols} data={createRows()} />
        </div>

    </div>;
}

const alumList = [
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
    

const cols = [
    { label: '', justify:'center', visible: 'all' },
    { label: 'Name', justify:'start', visible: 'all' },
    { label: 'Graduation Year', justify:'center', visible: 'md' },
    { label: 'Location', justify:'center', visible: 'lg' },
    { label: 'Field Of Work', justify:'center', visible: 'lg' },
    { label: 'Skills', justify:'start', visible: 'md' },
    { label: 'Quick Actions', justify:'center', visible: 'all' },
];

function createRows() {
    const data = [];

    for (const alum of alumList) {
        const row = {};

        row[''] = (
            <div className='w-12 h-12 m-4'>
                <img
                src={alum.image}
                alt={`${alum.alumname}'s avatar`}
                className="w-full h-full object-cover rounded-full"
            />
            </div>
            
        );
        
        row['Name'] = (
            <div>
                <div className='font-rb'>{alum.alumname}</div>
                <div className='font-s text-astradarkgray'>{alum.email}</div>
            </div>
        );

        row['Graduation Year'] = <div className='font-s text-astradarkgray text-center'>{alum.graduationYear}</div>;

        row['Location'] = <div className='font-s text-astradarkgray text-center'>{alum.location}</div>;

        row['Field Of Work'] = <div className='font-s text-astradarkgray text-center'>{alum.fieldOfWork}</div>;

        row['Skills'] = (
            <div className="relative group w-full flex justify-center">
                <div className="flex flex-wrap justify-center">
                    {alum.skills.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="inline-block px-4 py-1 mr-2 mb-2 text-sm text-astradarkgray bg-astragray rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
        
                {alum.skills.length > 3 && (
                    <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden group-hover:flex flex-col mt-2 p-4 bg-astratintedwhite text-astrablack shadow-lg rounded-xl w-max max-w-xs border border-astragray">
                        {alum.skills.map((skill, index) => (
                            <div key={index} className="px-2 py-1 text-sm whitespace-nowrap">
                                {skill}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
        
        
        
        row['Quick Actions'] = (
            <div className='flex justify-center'>
                <button className='gray-button font-sb'>View</button>
            </div>
        );

        data.push(row);
    }

    return data;
}
    