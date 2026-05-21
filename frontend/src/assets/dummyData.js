// src/components/HomeCourses/dummydata.js
import HC1 from "../assets/HC1.png";
import HC2 from "../assets/HC2.png";
import HC3 from "../assets/HC3.png";
import HC4 from "../assets/HC4.png";
import HC5 from "../assets/HC5.png";
import HC6 from "../assets/HC6.png";
import HC7 from "../assets/HC7.png";
import HC8 from "../assets/HC8.png";

const courses = [
  {
    id: 9,
    name: "React Masterclass",
    teacher: "Sophia Miller",
    image: HC1,
    rating: 4.8,
    category: "Development",
    price: { original: 200, sale: 99 },
    overview: "Master React from fundamentals to advanced patterns. Learn hooks, state management, performance optimization, and real-world project architecture. Build scalable applications with modern React ecosystem tools and best practices used by top tech companies.",
    lectures: [
      {
        id: "1-1",
        title: "Intro & Setup",
        durationMin: 12,
        chapters: [
          { id: "1-1-1", name: "Course intro", topic: "What we'll build", durationMin: 4, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "1-1-2", name: "Environment", topic: "Node, npm, editor setup", durationMin: 8, videoUrl: "https://youtu.be/4eGJp3LBLIA" }
        ]
      },
      {
        id: "1-2",
        title: "JSX & Components",
        durationMin: 30,
        chapters: [
          { id: "1-2-1", name: "JSX basics", topic: "Syntax & expressions", durationMin: 10, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "1-2-2", name: "Functional components", topic: "Props & composition", durationMin: 10, videoUrl: "https://youtu.be/_EiO98jSAb8" },
          { id: "1-2-3", name: "Styling components", topic: "CSS modules & Tailwind", durationMin: 10, videoUrl: "https://youtu.be/Fm_wxwEChCk" }
        ]
      },
      {
        id: "1-3",
        title: "State & Hooks",
        durationMin: 46,
        chapters: [
          { id: "1-3-1", name: "useState", topic: "Local state patterns", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "1-3-2", name: "useEffect", topic: "Side effects & cleanup", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "1-3-3", name: "Custom hooks", topic: "Reusing logic", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "1-3-4", name: "Performance hooks", topic: "useMemo & useCallback", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E" }
        ]
      },
      {
        id: "1-4",
        title: "Routing & Data",
        durationMin: 34,
        chapters: [
          { id: "1-4-1", name: "React Router", topic: "Routes & params", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "1-4-2", name: "Fetching data", topic: "fetch, axios & patterns", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "1-4-3", name: "State management intro", topic: "Context vs libs", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" }
        ]
      }
    ]
  },

  {
    id: 10,
    name: "Web Development ",
    teacher: "John Smith",
    image: HC2,
    rating: 4.8,
    category: "Development",
    price: null, // FREE COURSE
    isFree: true,
    overview: "Complete web development course covering HTML, CSS, JavaScript, and modern deployment practices. Learn to build responsive, accessible websites and deploy them to production. Perfect for beginners starting their web development journey.",
    lectures: [
      {
        id: "2-1",
        title: "HTML & Semantics",
        durationMin: 25,
        chapters: [
          { id: "2-1-1", name: "HTML Basics", topic: "Tags & structure", durationMin: 10, videoUrl: "https://youtu.be/4eGJp3LBLIA" },
          { id: "2-1-2", name: "Forms & Accessibility", topic: "Forms, ARIA", durationMin: 15, videoUrl: "https://youtu.be/sDoiClRyV_c" }
        ]
      },
      {
        id: "2-2",
        title: "CSS Layouts",
        durationMin: 40,
        chapters: [
          { id: "2-2-1", name: "Flexbox", topic: "Layouts", durationMin: 20, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "2-2-2", name: "Grid", topic: "Advanced layouts", durationMin: 20, videoUrl: "https://youtu.be/_EiO98jSAb8" }
        ]
      },
      {
        id: "2-3",
        title: "Deploy & Hosting",
        durationMin: 20,
        chapters: [
          { id: "2-3-1", name: "Netlify & Vercel", topic: "Deploy flow", durationMin: 10, videoUrl: "https://youtu.be/Fm_wxwEChCk" },
          { id: "2-3-2", name: "Domain & SSL", topic: "DNS basics", durationMin: 10, videoUrl: "https://youtu.be/4eGJp3LBLIA" }
        ]
      }
    ]
  },

  {
    id: 11,
    name: "Advanced JavaScript",
    teacher: "Sarah Johnson",
    image: HC3,
    rating: 4.9,
    category: "Development",
    price: { original: 149, sale: 79 },
    overview: "Deep dive into modern JavaScript features, patterns, and best practices. Master ES6+, asynchronous programming, functional programming concepts, and module systems to write clean, maintainable, and efficient JavaScript code.",
    lectures: [
      {
        id: "3-1",
        title: "Modern JS",
        durationMin: 35,
        chapters: [
          { id: "3-1-1", name: "ES6+", topic: "let/const, arrow functions", durationMin: 12, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "3-1-2", name: "Async JS", topic: "Promises & async/await", durationMin: 23, videoUrl: "https://youtu.be/JGwfuuyJX5E" }
        ]
      },
      {
        id: "3-2",
        title: "Patterns & FP",
        durationMin: 28,
        chapters: [
          { id: "3-2-1", name: "Functional patterns", topic: "map/filter/reduce", durationMin: 14, videoUrl: "https://youtu.be/_EiO98jSAb8" },
          { id: "3-2-2", name: "Module patterns", topic: "IIFE, modules", durationMin: 14, videoUrl: "https://youtu.be/Fm_wxwEChCk" }
        ]
      }
    ]
  },

  {
    id: 12,
    name: "UI/UX Design ",
    teacher: "Mike Chen",
    image: HC4,
    rating: 4.7,
    category: "Design",
    price: null, // FREE COURSE
    isFree: true,
    overview: "Comprehensive UI/UX design course covering design principles, user research, wireframing, prototyping, and design systems. Learn industry-standard tools like Figma and build portfolio-ready design projects from concept to completion.",
    lectures: [
      {
        id: "4-1",
        title: "Design Fundamentals",
        durationMin: 30,
        chapters: [
          { id: "4-1-1", name: "Principles", topic: "Contrast, hierarchy", durationMin: 10, videoUrl: "https://youtu.be/4eGJp3LBLIA" },
          { id: "4-1-2", name: "Typography", topic: "Type pairing", durationMin: 10, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "4-1-3", name: "Color theory", topic: "Palettes & accessibility", durationMin: 10, videoUrl: "https://youtu.be/JGwfuuyJX5E" }
        ]
      },
      {
        id: "4-2",
        title: "Prototyping",
        durationMin: 25,
        chapters: [
          { id: "4-2-1", name: "Figma basics", topic: "Frames & components", durationMin: 15, videoUrl: "https://youtu.be/_EiO98jSAb8" },
          { id: "4-2-2", name: "User flows", topic: "Mapping flows", durationMin: 10, videoUrl: "https://youtu.be/Fm_wxwEChCk" }
        ]
      }
    ]
  },

  {
    id: 13,
    name: "Data Science ",
    teacher: "Dr. Emily Wilson",
    image: HC5,
    rating: 4.6,
    category: "Data Science",
    price: { original: 229, sale: 129 },
    overview: "Introduction to data science with Python. Learn data manipulation with pandas, statistical analysis, data visualization, and basic machine learning concepts. Perfect for beginners interested in data analysis and business intelligence.",
    lectures: [
      {
        id: "5-1",
        title: "Python for Data",
        durationMin: 40,
        chapters: [
          { id: "5-1-1", name: "Numpy & Pandas", topic: "Data handling", durationMin: 20, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "5-1-2", name: "Visualization", topic: "Matplotlib & Seaborn", durationMin: 20, videoUrl: "https://youtu.be/JGwfuuyJX5E" }
        ]
      },
      {
        id: "5-2",
        title: "Statistics",
        durationMin: 30,
        chapters: [
          { id: "5-2-1", name: "Descriptive stats", topic: "mean/median/var", durationMin: 15, videoUrl: "https://youtu.be/_EiO98jSAb8" },
          { id: "5-2-2", name: "Inferential stats", topic: "hypothesis testing", durationMin: 15, videoUrl: "https://youtu.be/Fm_wxwEChCk" }
        ]
      }
    ]
  },

  {
    id: 14,
    name: "Mobile App Development",
    teacher: "Alex Rodriguez",
    image: HC6,
    rating: 4.8,
    category: "Development",
    price: { original: 169, sale: 99 },
    overview: "Build cross-platform mobile applications with React Native. Learn mobile UI patterns, navigation, state management, and deployment to app stores. Create professional mobile apps for both iOS and Android from a single codebase.",
    lectures: [
      {
        id: "6-1",
        title: "Intro to Mobile",
        durationMin: 20,
        chapters: [
          { id: "6-1-1", name: "Platform choices", topic: "Native vs hybrid", durationMin: 10, videoUrl: "https://youtu.be/4eGJp3LBLIA" },
          { id: "6-1-2", name: "Setup & tools", topic: "Emulators & IDEs", durationMin: 10, videoUrl: "https://youtu.be/sDoiClRyV_c" }
        ]
      },
      {
        id: "6-2",
        title: "React Native Basics",
        durationMin: 40,
        chapters: [
          { id: "6-2-1", name: "Components & navigation", topic: "Stacks & tabs", durationMin: 20, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "6-2-2", name: "Styling & layouts", topic: "Flex in RN", durationMin: 20, videoUrl: "https://youtu.be/_EiO98jSAb8" }
        ]
      }
    ]
  },

  {
    id: 15,
    name: "Machine Learning Basics",
    teacher: "Dr. James Brown",
    image: HC7,
    rating: 4.9,
    category: "AI/ML",
    price: null, // FREE COURSE
    isFree: true,
    overview: "Comprehensive machine learning course covering supervised and unsupervised learning algorithms, model evaluation, and real-world applications. Build and deploy ML models using Python and scikit-learn for practical problem-solving.",
    lectures: [
      {
        id: "7-1",
        title: "ML Basics",
        durationMin: 45,
        chapters: [
          { id: "7-1-1", name: "Supervised learning", topic: "Regression & classification", durationMin: 20, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "7-1-2", name: "Unsupervised learning", topic: "Clustering & PCA", durationMin: 25, videoUrl: "https://youtu.be/JGwfuuyJX5E" }
        ]
      },
      {
        id: "7-2",
        title: "Model Evaluation",
        durationMin: 25,
        chapters: [
          { id: "7-2-1", name: "Metrics", topic: "Precision/recall/F1", durationMin: 12, videoUrl: "https://youtu.be/_EiO98jSAb8" },
          { id: "7-2-2", name: "Cross-validation", topic: "K-fold", durationMin: 13, videoUrl: "https://youtu.be/Fm_wxwEChCk" }
        ]
      }
    ]
  },

  {
    id: 16,
    name: "Digital Marketing",
    teacher: "Lisa Wang",
    image: HC8,
    rating: 4.5,
    category: "Marketing",
    price: { original: 139, sale: 69 },
    overview: "Master digital marketing strategies including SEO, content marketing, social media, and paid advertising. Learn to create effective marketing campaigns, analyze performance metrics, and drive business growth through digital channels.",
    lectures: [
      {
        id: "8-1",
        title: "Marketing Foundations",
        durationMin: 28,
        chapters: [
          { id: "8-1-1", name: "Market research", topic: "Audience & product-market fit", durationMin: 14, videoUrl: "https://youtu.be/4eGJp3LBLIA" },
          { id: "8-1-2", name: "Branding basics", topic: "Voice & identity", durationMin: 14, videoUrl: "https://youtu.be/sDoiClRyV_c" }
        ]
      },
      {
        id: "8-2",
        title: "Channels & Funnels",
        durationMin: 30,
        chapters: [
          { id: "8-2-1", name: "SEO & Content", topic: "Organic growth", durationMin: 15, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "8-2-2", name: "Paid Ads", topic: "Google & Meta basics", durationMin: 15, videoUrl: "https://youtu.be/_EiO98jSAb8" }
        ]
      }
    ]
  },

  {
    id: 17,
    name: "Graphic Design Mastery",
    teacher: "Robert Taylor",
    image: HC1,
    rating: 4.7,
    category: "Design",
    price: { original: 159, sale: 89 },
    overview: "Complete graphic design course covering Adobe Creative Suite, design principles, typography, and layout techniques. Learn to create professional logos, branding materials, and digital graphics for various media platforms.",
    lectures: [
      {
        id: "9-1",
        title: "Design Tools",
        durationMin: 35,
        chapters: [
          { id: "9-1-1", name: "Photoshop basics", topic: "Tools & masks", durationMin: 18, videoUrl: "https://youtu.be/Fm_wxwEChCk" },
          { id: "9-1-2", name: "Illustrator basics", topic: "Vectors & pen tool", durationMin: 17, videoUrl: "https://youtu.be/4eGJp3LBLIA" }
        ]
      },
      {
        id: "9-2",
        title: "Layout & Composition",
        durationMin: 25,
        chapters: [
          { id: "9-2-1", name: "Grids", topic: "Balance & alignment", durationMin: 12, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "9-2-2", name: "Print design", topic: "Bleeds & CMYK", durationMin: 13, videoUrl: "https://youtu.be/JGwfuuyJX5E" }
        ]
      }
    ]
  },

  {
    id: 18,
    name: "Python Programming Basics",
    teacher: "Maria Garcia",
    image: HC2,
    rating: 4.8,
    category: "Development",
    price: null, // FREE COURSE
    isFree: true,
    overview: "Learn Python programming from scratch. Master syntax, data structures, functions, file handling, and object-oriented programming. Build practical projects and develop problem-solving skills with one of the world's most popular programming languages.",
    lectures: [
      {
        id: "10-1",
        title: "Python Basics",
        durationMin: 40,
        chapters: [
          { id: "10-1-1", name: "Syntax & types", topic: "Data types & control flow", durationMin: 20, videoUrl: "https://youtu.be/4eGJp3LBLIA" },
          { id: "10-1-2", name: "Functions & modules", topic: "Reusability", durationMin: 20, videoUrl: "https://youtu.be/sDoiClRyV_c" }
        ]
      },
      {
        id: "10-2",
        title: "Files & Packages",
        durationMin: 22,
        chapters: [
          { id: "10-2-1", name: "File IO", topic: "Reading/writing files", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "10-2-2", name: "Virtualenv", topic: "Dependency management", durationMin: 10, videoUrl: "https://youtu.be/_EiO98jSAb8" }
        ]
      }
    ]
  },

  {
    id: 19,
    name: "Cloud Computing",
    teacher: "David Kim",
    image: HC3,
    rating: 4.6,
    category: "Cloud",
    price: { original: 189, sale: 109 },
    overview: "Master cloud computing fundamentals with AWS, Azure, and Google Cloud. Learn infrastructure as code, containerization, serverless computing, and cloud security. Deploy scalable applications and manage cloud resources efficiently.",
    lectures: [
      {
        id: "11-1",
        title: "Cloud Fundamentals",
        durationMin: 35,
        chapters: [
          { id: "11-1-1", name: "Core concepts", topic: "IaaS, PaaS, SaaS", durationMin: 15, videoUrl: "https://youtu.be/sDoiClRyV_c" },
          { id: "11-1-2", name: "Regions & Zones", topic: "High availability", durationMin: 20, videoUrl: "https://youtu.be/4eGJp3LBLIA" }
        ]
      },
      {
        id: "11-2",
        title: "Compute & Storage",
        durationMin: 28,
        chapters: [
          { id: "11-2-1", name: "VMs & Containers", topic: "EC2 & Docker", durationMin: 14, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "11-2-2", name: "Storage options", topic: "S3 & block storage", durationMin: 14, videoUrl: "https://youtu.be/_EiO98jSAb8" }
        ]
      }
    ]
  },

  {
    id: 20,
    name: "Cybersecurity Essentials",
    teacher: "Amanda Lee",
    image: HC4,
    rating: 4.9,
    category: "Security",
    price: { original: 199, sale: 119 },
    overview: "Comprehensive cybersecurity course covering threat detection, network security, secure coding practices, and incident response. Learn to protect systems and data from cyber threats and build a career in information security.",
    lectures: [
      {
        id: "12-1",
        title: "Security Basics",
        durationMin: 30,
        chapters: [
          { id: "12-1-1", name: "Threat types", topic: "Malware, phishing", durationMin: 15, videoUrl: "https://youtu.be/4eGJp3LBLIA" },
          { id: "12-1-2", name: "Defensive basics", topic: "Firewalls & ACLs", durationMin: 15, videoUrl: "https://youtu.be/sDoiClRyV_c" }
        ]
      },
      {
        id: "12-2",
        title: "Hands-on Security",
        durationMin: 35,
        chapters: [
          { id: "12-2-1", name: "Secure coding", topic: "OWASP top 10", durationMin: 18, videoUrl: "https://youtu.be/JGwfuuyJX5E" },
          { id: "12-2-2", name: "Incident response", topic: "Playbooks & triage", durationMin: 17, videoUrl: "https://youtu.be/_EiO98jSAb8" }
        ]
      }
    ]
  }
];

export const getCourseById = (id) => courses.find((c) => c.id === id);

export default courses;