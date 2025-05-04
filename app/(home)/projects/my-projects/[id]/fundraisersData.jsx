export const fundraisers = [
  {
    id: "fund1",
    title: "Tech Education for Underserved Communities",
    description: "This initiative aims to provide technology education and resources to underserved communities, empowering children and young adults with digital skills necessary for future careers. We'll set up computer labs, provide coding classes, and mentor students from disadvantaged backgrounds.",
    goal: "$15,000",
    raised: "$8,765",
    donors: 47,
    type: "Education",
    status: "approved",
    createdAt: "2024-12-15T14:30:00Z",
    endDate: "2025-07-15T23:59:59Z",
    image: "/images/fundraisers/tech-education.jpg",
    messages: [
      {
        id: "msg1",
        sender: "Support Team",
        content: "Congratulations on your approved fundraiser! Let us know if you need any assistance with your campaign.",
        timestamp: "2024-12-16T09:12:00Z",
        isRead: true
      },
      {
        id: "msg2",
        sender: "Support Team",
        content: "Your fundraiser is gaining traction! Consider sharing updates about your progress to engage with donors.",
        timestamp: "2025-01-22T15:43:00Z",
        isRead: false
      }
    ]
  },
  {
    id: "fund2",
    title: "Community Garden Revitalization",
    description: "Our neighborhood community garden needs revitalization. Funds will be used to purchase new soil, seeds, tools, build accessible garden boxes, and establish an irrigation system. This project will provide fresh produce to local food banks and create a beautiful space for community gatherings.",
    goal: "$5,000",
    raised: "$4,250",
    donors: 89,
    type: "Community",
    status: "approved",
    createdAt: "2025-02-03T10:15:00Z",
    endDate: "2025-06-30T23:59:59Z",
    image: "/images/fundraisers/community-garden.jpg",
    messages: [
      {
        id: "msg3",
        sender: "Support Team",
        content: "Your fundraiser has been approved! Feel free to start sharing it with your network.",
        timestamp: "2025-02-04T11:30:00Z",
        isRead: true
      }
    ]
  },
  {
    id: "fund3",
    title: "Scholarship Fund for First-Generation College Students",
    description: "This scholarship fund will support first-generation college students with financial aid for tuition, books, and living expenses. Our goal is to help talented students overcome financial barriers to higher education and achieve their academic dreams.",
    goal: "$25,000",
    type: "Scholarship",
    status: "pending",
    createdAt: "2025-04-18T16:45:00Z",
    endDate: "2025-12-31T23:59:59Z",
    image: "/images/fundraisers/scholarship-fund.jpg",
    messages: [
      {
        id: "msg4",
        sender: "Support Team",
        content: "We're currently reviewing your fundraiser request. We'll get back to you within 3-5 business days.",
        timestamp: "2025-04-19T09:10:00Z",
        isRead: true
      }
    ]
  },
  {
    id: "fund4",
    title: "Mental Health Resources for Veterans",
    description: "This fundraiser aims to provide essential mental health resources and counseling services to veterans in our community. The funds will support therapy sessions, wellness workshops, and community-building activities designed specifically for veterans' needs.",
    goal: "$12,000",
    type: "Healthcare",
    status: "rejected",
    createdAt: "2025-03-07T13:20:00Z",
    endDate: "2025-09-30T23:59:59Z",
    image: "/images/fundraisers/veterans-health.jpg",
    rejectionReason: "The fundraiser needs more specific information about how funds will be allocated and managed.",
    adminFeedback: [
      "Please provide credentials or partnerships with licensed mental health providers.",
      "The budget breakdown is missing - we need detailed information on how funds will be allocated.",
      "Include information about how veterans will be verified and selected for the program."
    ],
    messages: [
      {
        id: "msg5",
        sender: "Support Team",
        content: "We've reviewed your fundraiser request and need additional information. Please check the rejection details.",
        timestamp: "2025-03-10T11:15:00Z",
        isRead: false
      },
      {
        id: "msg6",
        sender: "Support Team",
        content: "We encourage you to resubmit with the requested information. We're happy to help guide you through the process.",
        timestamp: "2025-03-10T11:17:00Z",
        isRead: false
      }
    ]
  },
  {
    id: "fund5",
    title: "Clean Water Initiative for Rural Areas",
    description: "Our clean water initiative aims to bring sustainable water solutions to rural communities facing water scarcity and contamination issues. Funds will support the installation of water purification systems, well drilling, and education on water conservation practices.",
    goal: "$20,000",
    raised: "$1,540",
    donors: 12,
    type: "Community",
    status: "approved",
    createdAt: "2025-01-10T08:45:00Z",
    endDate: "2025-07-31T23:59:59Z",
    image: "/images/fundraisers/clean-water.jpg",
    messages: [
      {
        id: "msg7",
        sender: "Support Team",
        content: "Your fundraiser has been approved! We suggest adding more photos of your previous clean water projects to build trust with potential donors.",
        timestamp: "2025-01-11T14:20:00Z",
        isRead: true
      }
    ]
  },
  {
    id: "fund6",
    title: "Youth Sports Equipment Fund",
    description: "Many families in our community cannot afford sports equipment for their children. This fundraiser will provide baseballs, bats, gloves, soccer balls, and other sports equipment to local youth programs, ensuring every child has the opportunity to participate regardless of financial circumstances.",
    goal: "$8,000",
    type: "Community",
    status: "pending",
    createdAt: "2025-04-25T09:30:00Z",
    endDate: "2025-08-15T23:59:59Z",
    image: "/images/fundraisers/sports-equipment.jpg",
    messages: [
      {
        id: "msg8",
        sender: "Support Team",
        content: "Thanks for submitting your fundraiser! Our team is reviewing it and will respond within 3-5 business days.",
        timestamp: "2025-04-25T16:05:00Z",
        isRead: true
      }
    ]
  },
  {
    id: "fund7",
    title: "Animal Shelter Renovation Project",
    description: "Our local animal shelter needs urgent renovations to improve living conditions for rescued animals. Funds will be used to repair the roof, upgrade kennels, improve the ventilation system, and create a better medical care area for sick and injured animals.",
    goal: "$18,500",
    type: "Community",
    status: "rejected",
    createdAt: "2025-02-28T11:50:00Z",
    endDate: "2025-08-31T23:59:59Z",
    image: "/images/fundraisers/animal-shelter.jpg",
    rejectionReason: "The fundraiser application lacks required documentation and specific project details.",
    adminFeedback: [
      "Please provide documentation confirming your affiliation with the animal shelter.",
      "A detailed breakdown of renovation costs is needed for transparency.",
      "Include architectural plans or estimates from contractors to validate the project scope."
    ],
    messages: [
      {
        id: "msg9",
        sender: "Support Team",
        content: "We've reviewed your fundraiser application and need additional documentation. Please see the rejection details for more information.",
        timestamp: "2025-03-03T10:25:00Z",
        isRead: true
      }
    ]
  }
];