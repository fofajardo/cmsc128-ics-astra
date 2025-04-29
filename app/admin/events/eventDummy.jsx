// app/admin/events/eventDummy.js

import venue1 from "../../assets/venue1.jpeg";
import venue2 from "../../assets/venue2.jpeg";
import avatar1 from "../../assets/avatar1.jpg";
import avatar2 from "../../assets/avatar.png";
import avatar3 from "../../assets/avatar3.jpg";


const eventList = [
  {
    id: 1,
    imageSrc: venue1,
    title: "Alumni Homecoming",
    location: "ICS",
    type: "In-Person",
    date: "April 1, 2025",
    description: "Catch up with old friends and make new connections.",
    going: 80,
    interested: 20,
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
    interestedList: [
      {
        name: "Daniel Kim",
        title: "Full Stack Engineer",
        company: "Facebook",
        classYear: 2020,
        avatar: avatar1.src
      },
      {
        name: "Sophia Carter",
        title: "DevOps Engineer",
        company: "Slack",
        classYear: 2018,
        avatar: avatar2.src
      },
      {
        name: "Jackson Rivera",
        title: "Security Analyst",
        company: "Cloudflare",
        classYear: 2016,
        avatar: avatar3.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    location: "Auditorium",
    imageSrc: venue2,
    type: "In-Person",
    date: "May 15, 2025",
    going: 120,
    interested: 45,
    description: "Join industry leaders as they talk latest tech trends.",
    going: 10,
    interested: 90,
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
    interestedList: [
      {
        name: "Olivia Martinez",
        title: "Product Designer",
        company: "Adobe",
        classYear: 2015,
        avatar: avatar1.src
      },
      {
        name: "Liam Anderson",
        title: "Backend Developer",
        company: "Spotify",
        classYear: 2017,
        avatar: avatar2.src
      },
      {
        name: "Mia Robinson",
        title: "Business Analyst",
        company: "Deloitte",
        classYear: 2014,
        avatar: avatar3.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 3,
    imageSrc: venue1,
    title: "Virtual Networking",
    location: "Online",
    type: "Online",
    date: "June 5, 2025",
    going: 90,
    description: "Connecting with various alumni of the campus",
    interested: 30,
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
    interestedList: [
      {
        name: "Daniel Kim",
        title: "Full Stack Engineer",
        company: "Facebook",
        classYear: 2020,
        avatar: avatar1.src
      },
      {
        name: "Sophia Carter",
        title: "DevOps Engineer",
        company: "Slack",
        classYear: 2018,
        avatar: avatar2.src
      },
      {
        name: "Jackson Rivera",
        title: "Security Analyst",
        company: "Cloudflare",
        classYear: 2016,
        avatar: avatar3.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 4,
    imageSrc: venue2,
    title: "Startup Pitch Night",
    location: "Business Center",
    type: "In-Person",
    date: "July 10, 2025",
    description: "Explore the startup ideas of recent graduates.",
    going: 50,
    interested: 15,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 5,
    imageSrc: venue1,
    title: "Career Fair",
    location: "Main Hall",
    type: "In-Person",
    date: "August 20, 2025",
    going: 200,
    interested: 70,
    attendeesList: [
      {
        name: "Lucas Torres",
        title: "Startup Founder",
        company: "Stealth Mode",
        classYear: 2015,
        avatar: avatar2.src
      },
      {
        name: "Avery Scott",
        title: "Investor",
        company: "Sequoia Capital",
        classYear: 2013,
        avatar: avatar3.src
      },
      {
        name: "Amelia Adams",
        title: "Innovation Manager",
        company: "Salesforce",
        classYear: 2012,
        avatar: avatar1.src
      }
    ],
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."

  },
  {
    id: 6,
    imageSrc: venue1,
    title: "Coding Bootcamp",
    location: "Online",
    type: "Online",
    date: "September 3, 2025",
    description: "Learn how to take care of your mental health.",
    going: 150,
    interested: 60,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 7,
    title: "Entrepreneurship Workshop",
    location: "Business Center",
    imageSrc: venue2,
    description: "Get smart about your money post-graduation.",
    type: "In-Person",
    date: "October 12, 2025",
    going: 75,
    interested: 25,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."

  },
  {
    id: 8,
    imageSrc: venue1,
    title: "Alumni Panel Talk",
    location: "Conference Room B",
    type: "In-Person",
    date: "November 5, 2025",
    going: 95,
    interested: 40,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."

  },
  {
    id: 9,
    imageSrc: venue2,
    title: "Holiday Mixer",
    location: "ICS",
    description: "Get smart about your money post-graduation.",
    type: "In-Person",
    date: "December 18, 2025",
    going: 130,
    interested: 50,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 10,
    imageSrc: venue1,
    title: "Web Dev Summit",
    location: "Auditorium",
    type: "In-Person",
    date: "January 20, 2026",
    going: 180,
    description: "Get smart about your money post-graduation.",
    interested: 90,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 11,
    imageSrc: venue2,
    title: "AI and Data Science Conference",
    location: "Online",
    type: "Online",
    date: "February 14, 2026",
    description: "Get smart about your money post-graduation.",
    going: 210,
    interested: 110,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
  {
    id: 12,
    title: "Blockchain Expo",
    location: "Business Center",
    imageSrc: venue1,
    type: "In-Person",
    date: "March 5, 2026",
    going: 160,
    description: "Get smart about your money post-graduation.",
    interested: 70,
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
    interestedList: [
      {
        name: "Ethan Wright",
        title: "Technical Writer",
        company: "Atlassian",
        classYear: 2017,
        avatar: avatar3.src
      },
      {
        name: "Ella Parker",
        title: "Data Analyst",
        company: "Uber",
        classYear: 2021,
        avatar: avatar1.src
      }
    ],
    eventDetail: "The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation."
  },
];

export default eventList;
