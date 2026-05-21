import A1 from "../assets/A1.png"
import A2 from "../assets/A2.png"
import A3 from "../assets/A3.png"
import A4 from "../assets/A4.png"
import AT1   from "../assets/AT1.png"
import AT2 from "../assets/AT2.png"
import AT3 from "../assets/AT3.png"

import {
  Users,
  BookOpen,
  Award,
  Globe,
  GraduationCap,
  Clock,
  Target,
  Eye,
  Heart,
} from "lucide-react";

export const counterTargets = {
  students: 50000,
  courses: 2500,
  successRate: 95,
  countries: 150,
  certificates: 1000000,
  support: 24,
};

export const statsMeta = [
  {
    key: "students",
    label: "Active Students",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    key: "courses",
    label: "Courses",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    key: "successRate",
    label: "Success Rate",
    icon: Award,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    key: "countries",
    label: "Countries",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
  },
  {
    key: "support",
    label: "Support",
    icon: Clock,
    color: "from-teal-500 to-green-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-green-50",
  },
];

export const missionVisionValues = [
  {
    type: "mission",
    icon: Target,
    title: "Our Mission",
    subtitle: "Open Access Global Education",
    description:
      "To make high-quality education accessible and affordable for everyone, everywhere. We believe learning should have no boundaries.",
    dotLottie: "https://lottie.host/d4aed205-8352-4490-a20a-83e4b3b3e2f6/f3nl34gaEN.lottie",
    features: [
      "Accessible to all backgrounds",
      "Affordable pricing models",
      "Global learning community",
      "Industry-relevant skills",
    ],
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
  },
  {
    type: "vision",
    icon: Eye,
    title: "Our Vision",
    subtitle: "Shaping Future Leaders",
    description:
      "To create a world where anyone can learn, grow, and achieve their full potential through transformative educational experiences.",
    dotLottie: "https://lottie.host/591f8a0f-faba-495a-9a38-ff1bf44b5fad/W30zLs2vep.lottie",
    features: [
      "Lifelong learning journeys",
      "Future-ready skills",
      "Global impact",
      "Innovation in education",
    ],
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
  },
  {
    type: "values",
    icon: Heart,
    title: "Our Values",
    subtitle: "Principles That Guide Us",
    description:
      "Our core values shape every decision we make and define our commitment to students, instructors, and the global community.",
    dotLottie: "https://lottie.host/4cf976d2-0a1a-4017-b021-c3fe2b0a4c18/ksM0OM58Dd.lottie",
    features: [
      "Student success first",
      "Excellence in teaching",
      "Innovation & creativity",
      "Community & collaboration",
    ],
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
  },
];

export const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image:A1,
    bio: "15+ years in education technology",
    social: ["twitter", "linkedin", "github"],
  },
  {
    name: "Michael Chen",
    role: "Chief Learning Officer",
    image:A2,
    bio: "Former university professor and curriculum expert",
    social: ["twitter", "linkedin"],
  },
  {
    name: "Emily Rodriguez",
    role: "Product Director",
    image:A3,
    bio: "Specialized in user experience and learning design",
    social: ["twitter", "linkedin", "dribbble"],
  },
  {
    name: "David Kim",
    role: "Tech Lead",
    image:A4,
    bio: "Full-stack developer and system architect",
    social: ["twitter", "linkedin", "github"],
  },
];

export const values = [
  {
    title: "Quality Education",
    description:
      "We believe in providing top-notch educational content that transforms lives through expert-curated curriculum.",
    features: ["Expert Instructors", "Updated Content", "Industry Standards"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Student First",
    description:
      "Every decision we make is centered around our students' success and growth journey.",
    features: ["Personalized Learning", "Career Support", "Community Building"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Continuous Creation",
    description:
      "We constantly evolve our platform to incorporate the latest learning technologies and methodologies.",
    features: ["AI Learning", "Interactive Labs", "Mobile First"],
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Lifetime Access",
    description:
      "Learn at your own pace with lifetime access to all course materials and future updates.",
    features: ["Forever Access", "Free Updates", "Skill Tracking"],
    color: "from-orange-500 to-amber-500",
  },
];

export const milestones = [
  {
    year: "2018",
    event: "LearnHub Founded",
    description: "Started with 10 courses and 500 students",
  },
  {
    year: "2019",
    event: "Mobile App Launch",
    description: "Released iOS and Android learning apps",
  },
  {
    year: "2020",
    event: "Global Expansion",
    description: "Expanded to 50+ countries worldwide",
  },
  {
    year: "2021",
    event: "AI Integration",
    description: "Implemented AI-powered learning paths",
  },
  {
    year: "2022",
    event: "1M Students",
    description: "Reached 1 million active learners",
  },
  {
    year: "2023",
    event: "Enterprise Launch",
    description: "Launched corporate training solutions",
  },
];

export const testimonials = [
  {
    name: "Alex Thompson",
    role: "Software Developer",
    image:AT1,
    text: "LearnHub transformed my career. The courses are comprehensive and the support is exceptional.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Data Scientist",
    image:AT2,
    text: "The quality of instruction and hands-on projects helped me land my dream job.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "UX Designer",
    image:AT3,
    text: "Best investment I've made in my professional development. Highly recommended!",
    rating: 5,
  },
];

// default export (optional)
export default {
  counterTargets,
  statsMeta,
  missionVisionValues,
  teamMembers,
  values,
  milestones,
  testimonials,
};
