import venue1 from "../assets/venue1.jpeg";
import venue2 from "../assets/venue2.jpeg";
import avatar1 from "../assets/avatar1.jpg";

const invitations = [
  {
    id: "alumni-homecoming-2024",
    imageSrc: venue1,
    title: "Alumni Homecoming 2024",
    description: "Join us for our annual alumni homecoming celebration!",
    date: "2024-06-15 14:00",
    location: "UPLB Institute of Computer Science",
    attendees: "0/100",
    avatars: [avatar1.src],
    status: "Open",
    theme: "blue",
    host: {
      name: "John Smith",
      title: "Alumni Association President",
      avatar: "/avatars/default.png"
    },
    eventDetail: "Join us for a day of reconnecting with fellow alumni, sharing memories, and celebrating our alma mater. The event will feature keynote speakers, networking sessions, and entertainment."
  },
  {
    id: "ics-tech-summit",
    imageSrc: venue2,
    title: "ICS Tech Summit",
    description: "A gathering of tech professionals and academics.",
    date: "2024-07-20 09:00",
    location: "UPLB CAS Auditorium",
    attendees: "0/200",
    avatars: [avatar1.src],
    status: "Open",
    theme: "green",
    host: {
      name: "Maria Garcia",
      title: "Event Coordinator",
      avatar: "/avatars/default.png"
    },
    eventDetail: "Join us for a day of tech talks, panel discussions, and networking with industry professionals and academics."
  },
  {
    id: "career-fair-2024",
    imageSrc: venue1,
    title: "Career Fair 2024",
    description: "Connect with potential employers in tech.",
    date: "2024-08-05 10:00",
    location: "UPLB Student Union",
    attendees: "0/300",
    avatars: [avatar1.src],
    status: "Open",
    theme: "red",
    host: {
      name: "David Chen",
      title: "Career Services Director",
      avatar: "/avatars/default.png"
    },
    eventDetail: "Join us for a day of networking with potential employers, learning about job opportunities, and attending career development workshops."
  }
];

export default invitations;
