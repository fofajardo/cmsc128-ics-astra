import venue1 from "../assets/venue1.jpeg";
import venue2 from "../assets/venue2.jpeg";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar.png";
import avatar3 from "../assets/avatar3.jpg";

const events = [
  {
    id: "alumni-meetup-2025",
    imageSrc: venue1,
    title: "Alumni Meetup 2025",
    description: "Catch up with old friends and make new connections.",
    date: "2025-05-01 18:00",
    location: "ICS Auditorium",
    attendees: "42/50",
    avatars: [avatar1.src, avatar2.src],
    status: "Open",
    theme: "blue",
    attendeesList: [
      {
        name: "Charlotte Lewis",
        title: "UX Designer",
        company: "LinkedIn",
        classYear: 2022,
        avatar: avatar3.src
      },
      {
        name: "Benjamin Walker",
        title: "Marketing Specialist",
        company: "Meta",
        classYear: 2016,
        avatar: avatar1.src
      },
      {
        name: "John Doe",
        title: "Product Manager",
        company: "Meta",
        classYear: 2013,
        avatar: avatar3.src
      },
      {
        name: "David Lee",
        title: "Data Scientist",
        company: "Google",
        classYear: 2012,
        avatar: avatar1.src
      },
      {
        name: "Sarah Johnson",
        title: "Marketing Specialist",
        company: "Twitter",
        classYear: 2013,
        avatar: avatar3.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: "tech-talk-tuesdays",
    imageSrc: venue2,
    title: "TechTalk Tuesdays",
    description: "Join industry leaders as they talk latest tech trends.",
    date: "2025-05-05 15:00",
    location: "CS Lecture Hall",
    attendees: "50/50",
    avatars: [avatar1.src, avatar2.src],
    status: "Closed",
    theme: "blue",
    attendeesList: [
      {
        name: "Carlos Fernandez",
        title: "Software Engineer",
        company: "Amazon",
        classYear: 2018,
        avatar: avatar2.src
      },
      {
        name: "Emily Nguyen",
        title: "Frontend Developer",
        company: "Netflix",
        classYear: 2019,
        avatar: avatar3.src
      },
      {
        name: "Kevin Patel",
        title: "Data Engineer",
        company: "Stripe",
        classYear: 2020,
        avatar: avatar2.src
      },
      {
        name: "Noah Lee",
        title: "AI Researcher",
        company: "OpenAI",
        classYear: 2021,
        avatar: avatar3.src
      },
      {
        name: "Grace Thompson",
        title: "Cloud Architect",
        company: "Microsoft",
        classYear: 2017,
        avatar: avatar2.src
      }
    ],
    eventDetail: "Engage with tech innovators discussing the latest trends in AI, web development, and cybersecurity. Expect real-life use cases and career insights."
  },
  {
    id: "start-up-showcase",
    imageSrc: venue1,
    title: "Start-up Showcase",
    description: "Explore the startup ideas of recent graduates.",
    date: "2025-06-01 10:00",
    location: "Innovation Hub",
    attendees: "38/50",
    avatars: [avatar1.src, avatar2.src],
    status: "Open",
    theme: "blue",
    attendeesList: [
      {
        name: "Zara Ali",
        title: "Founder & CEO",
        company: "Greenbyte",
        classYear: 2023,
        avatar: avatar1.src
      },
      {
        name: "Benjamin Wright",
        title: "CTO",
        company: "SafeNet",
        classYear: 2022,
        avatar: avatar3.src
      },
      {
        name: "Sophie Kim",
        title: "COO",
        company: "WellNest",
        classYear: 2024,
        avatar: avatar1.src
      },
      {
        name: "James Miller",
        title: "Full Stack Developer",
        company: "OpenBuild",
        classYear: 2023,
        avatar: avatar3.src
      },
      {
        name: "Ella Davis",
        title: "Marketing Lead",
        company: "EcoBox",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "Celebrate student innovation as graduates pitch their businesses to potential investors and collaborators. A chance to witness the next big thing!"
  },
  {
    id: "wellness-workshop",
    imageSrc: venue2,
    title: "Wellness Workshop",
    description: "Learn how to take care of your mental health.",
    date: "2025-06-10 14:00",
    location: "Room 204, Wellness Center",
    attendees: "45/50",
    avatars: [avatar1.src, avatar2.src],
    status: "Open",
    theme: "blue",
    attendeesList: [
      {
        name: "Daniel Robinson",
        title: "Yoga Instructor",
        company: "ZenFlow",
        classYear: 2015,
        avatar: avatar1.src
      },
      {
        name: "Hannah Moore",
        title: "Nutritionist",
        company: "HealthyU",
        classYear: 2016,
        avatar: avatar2.src
      },
      {
        name: "Leo Martinez",
        title: "Therapist",
        company: "Calm Minds",
        classYear: 2013,
        avatar: avatar1.src
      },
      {
        name: "Chloe Anderson",
        title: "Mindfulness Coach",
        company: "BalanceLife",
        classYear: 2014,
        avatar: avatar2.src
      },
      {
        name: "William Taylor",
        title: "Wellness Coordinator",
        company: "FitWell",
        classYear: 2018,
        avatar: avatar1.src
      }
    ],
    eventDetail: "Participate in hands-on sessions on mindfulness, nutrition, and emotional resilience led by trained wellness coaches."
  },
  {
    id: "finance-101",
    imageSrc: venue1,
    title: "Finance 101",
    description: "Get smart about your money post-graduation.",
    date: "2025-06-15 11:00",
    location: "Finance Lab, Bldg B",
    attendees: "25/50",
    avatars: [avatar1.src, avatar2.src],
    status: "Open",
    theme: "blue",
    attendeesList: [
      {
        name: "Mason Hill",
        title: "Financial Analyst",
        company: "Goldman Sachs",
        classYear: 2017,
        avatar: avatar2.src
      },
      {
        name: "Ava Martin",
        title: "Accountant",
        company: "Deloitte",
        classYear: 2016,
        avatar: avatar3.src
      },
      {
        name: "Ethan Gonzalez",
        title: "Investment Banker",
        company: "JP Morgan",
        classYear: 2015,
        avatar: avatar2.src
      },
      {
        name: "Natalie Baker",
        title: "Wealth Manager",
        company: "Fidelity",
        classYear: 2019,
        avatar: avatar3.src
      },
      {
        name: "Logan Rivera",
        title: "Credit Analyst",
        company: "Capital One",
        classYear: 2020,
        avatar: avatar2.src
      }
    ],
    eventDetail: "Learn budgeting, savings, and debt management in this interactive session geared toward young professionals."
  },
  {
    id: "career-fair-2025",
    imageSrc: venue2,
    title: "Career Fair 2025",
    description: "Meet top recruiters and explore new job opportunities.",
    date: "2025-07-01 09:00",
    location: "Main Hall",
    attendees: "48/50",
    avatars: [avatar1.src, avatar2.src],
    status: "Open",
    theme: "blue",
    attendeesList: [
      {
        name: "Liam Scott",
        title: "Recruiter",
        company: "Google",
        classYear: 2014,
        avatar: avatar1.src
      },
      {
        name: "Mia Perez",
        title: "HR Manager",
        company: "Facebook",
        classYear: 2013,
        avatar: avatar3.src
      },
      {
        name: "Elijah Adams",
        title: "Talent Acquisition",
        company: "Amazon",
        classYear: 2012,
        avatar: avatar2.src
      },
      {
        name: "Isabella Foster",
        title: "Recruiting Lead",
        company: "Apple",
        classYear: 2015,
        avatar: avatar3.src
      },
      {
        name: "Jackson Reed",
        title: "Campus Recruiter",
        company: "Microsoft",
        classYear: 2016,
        avatar: avatar1.src
      }
    ],
    eventDetail: "Connect with industry-leading companies and explore new career paths. Bring your resume and get ready to network!"
  }
];

export default events;
