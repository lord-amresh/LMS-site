// src/dummydata.js
import HC1 from "../assets/HC1.png";
import HC2 from "../assets/HC2.png";
import HC3 from "../assets/HC3.png";
import HC4 from "../assets/HC4.png";
import HC5 from "../assets/HC5.png";
import HC6 from "../assets/HC6.png";
import HC7 from "../assets/HC7.png";
import HC8 from "../assets/HC8.png";

export const coursesData = [
  {
    id: 1,
    name: "React Masterclass",
    teacher: "Sophia Miller",
    image: HC1,
    rating: 4.8,
    isFree: false,
    price: { original: 200, sale: 99 },
    overview: "Master React from fundamentals to advanced patterns. Learn hooks, state management, performance optimization, and real-world project architecture. Build scalable applications with modern React ecosystem tools and best practices used by top tech companies.",
    lectures: [
      {
        id: "1-1",
        title: "Intro & Setup",
        durationMin: 12,
        chapters: [
          { id: "1-1-1", name: "Course intro", topic: "What we'll build", durationMin: 4, videoUrl: "https://drive.google.com/file/d/1LsVJM1CquQtmp8fJX91oskMx1TjlplLJ/view?usp=drive_link" },
          { id: "1-1-2", name: "Environment", topic: "Node, npm, editor setup", durationMin: 8, videoUrl: "https://youtu.be/4eGJp3LBLIA?si=9t7IQ-gDqbUR0SAw" }
        ]
      },
      {
        id: "1-2",
        title: "JSX & Components",
        durationMin: 30,
        chapters: [
          { id: "1-2-1", name: "JSX basics", topic: "Syntax & expressions", durationMin: 10, videoUrl: "https://youtu.be/JGwfuuyJX5E?si=UB5xSzIr3G7P5uaA" },
          { id: "1-2-2", name: "Functional components", topic: "Props & composition", durationMin: 10, videoUrl: "https://youtu.be/_EiO98jSAb8?si=RApm9kuU8Ud1hY7a" },
          { id: "1-2-3", name: "Styling components", topic: "CSS modules & Tailwind", durationMin: 10, videoUrl: "https://youtu.be/Fm_wxwEChCk?si=3lekkBDLHldxjWKV" }
        ]
      },
      {
        id: "1-3",
        title: "State & Hooks",
        durationMin: 46,
        chapters: [
          { id: "1-3-1", name: "useState", topic: "Local state patterns", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "1-3-2", name: "useEffect", topic: "Side effects & cleanup", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E?si=UB5xSzIr3G7P5uaA" },
          { id: "1-3-3", name: "Custom hooks", topic: "Reusing logic", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "1-3-4", name: "Performance hooks", topic: "useMemo & useCallback", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E?si=UB5xSzIr3G7P5uaA" }
        ]
      },
      {
        id: "1-4",
        title: "Routing & Data",
        durationMin: 34,
        chapters: [
          { id: "1-4-1", name: "React Router", topic: "Routes & params", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "1-4-2", name: "Fetching data", topic: "fetch, axios & patterns", durationMin: 12, videoUrl: "https://youtu.be/JGwfuuyJX5E?si=UB5xSzIr3G7P5uaA" },
          { id: "1-4-3", name: "State management intro", topic: "Context vs libs", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" }
        ]
      }
    ]
  },

  {
    id: 2,
    name: "Frontend Crash Course",
    teacher: "Ethan Brown",
    image: HC2,
    rating: 4.7,
    isFree: true,
    price: null,
    overview: "Accelerate your frontend development journey with HTML, CSS, and JavaScript fundamentals. Perfect for beginners starting their web development career. Learn responsive design, accessibility, and modern CSS techniques to build beautiful, functional websites.",
    lectures: [
      {
        id: "2-1",
        title: "HTML & Accessibility",
        durationMin: 26,
        chapters: [
          { id: "2-1-1", name: "Semantic HTML", topic: "Structure & a11y basics", durationMin: 12, videoUrl: "https://youtu.be/6BrpMJeZuvQ?si=AHhbSJobh3kntX6Y" },
          { id: "2-1-2", name: "Forms & Inputs", topic: "Validation & UX", durationMin: 14, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" }
        ]
      },
      {
        id: "2-2",
        title: "CSS Layouts & Responsive",
        durationMin: 44,
        chapters: [
          { id: "2-2-1", name: "Flexbox deep dive", topic: "Alignment & patterns", durationMin: 18, videoUrl: "https://youtu.be/6BrpMJeZuvQ?si=AHhbSJobh3kntX6Y" },
          { id: "2-2-2", name: "CSS Grid", topic: "Complex layouts", durationMin: 18, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "2-2-3", name: "Responsive design", topic: "Media queries & mobile-first", durationMin: 8, videoUrl: "https://youtu.be/6BrpMJeZuvQ?si=AHhbSJobh3kntX6Y" }
        ]
      },
      {
        id: "2-3",
        title: "JavaScript Essentials",
        durationMin: 50,
        chapters: [
          { id: "2-3-1", name: "DOM & Events", topic: "Manipulation & listeners", durationMin: 15, videoUrl: "https://youtu.be/6BrpMJeZuvQ?si=AHhbSJobh3kntX6Y" },
          { id: "2-3-2", name: "ES6+", topic: "Let/const, arrow functions, modules", durationMin: 18, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "2-3-3", name: "Tooling", topic: "Bundlers & npm scripts", durationMin: 17, videoUrl: "https://youtu.be/6BrpMJeZuvQ?si=AHhbSJobh3kntX6Y" }
        ]
      }
    ]
  },

  {
    id: 3,
    name: "Full Stack JavaScript",
    teacher: "Noah Johnson",
    image: HC3,
    rating: 4.7,
    isFree: false,
    price: { original: 180, sale: 89 },
    overview: "Master full-stack JavaScript development with Node.js, Express, MongoDB, and React. Build complete web applications from database design to frontend implementation. Learn authentication, API development, deployment strategies, and modern development workflows.",
    lectures: [
      {
        id: "3-1",
        title: "Node & NPM",
        durationMin: 36,
        chapters: [
          { id: "3-1-1", name: "Node intro", topic: "Runtime & modules", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4" },
          { id: "3-1-2", name: "NPM & scripts", topic: "Packages, semver", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "3-1-3", name: "APIs with Express", topic: "Routes & middleware", durationMin: 14, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
        ]
      },
      {
        id: "3-2",
        title: "Databases",
        durationMin: 40,
        chapters: [
          { id: "3-2-1", name: "Relational vs NoSQL", topic: "When to use what", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "3-2-2", name: "MongoDB quickstart", topic: "Collections & queries", durationMin: 15, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
          { id: "3-2-3", name: "ORM/ODM", topic: "Mongoose & query patterns", durationMin: 15, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
        ]
      },
      {
        id: "3-3",
        title: "Fullstack Integration",
        durationMin: 52,
        chapters: [
          { id: "3-3-1", name: "Auth basics", topic: "JWT & sessions", durationMin: 18, videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { id: "3-3-2", name: "Frontend-backend flow", topic: "API design & CORS", durationMin: 16, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
          { id: "3-3-3", name: "Deploying fullstack", topic: "Hosting & env", durationMin: 18, videoUrl: "https://youtu.be/qU32Okw8nPs?si=PrHXTXnz_7wTVWLc" }
        ]
      }
    ]
  },

  {
    id: 4,
    name: "UX/UI Design Pro",
    teacher: "Olivia Lee",
    image: HC4,
    rating: 4.9,
    isFree: false,
    price: { original: 250, sale: 125 },
    overview: "Transform into a professional UX/UI designer. Master design thinking, user research, wireframing, prototyping, and design systems. Learn industry-standard tools like Figma and Adobe XD while building a portfolio-ready design project from scratch.",
    lectures: [
      {
        id: "4-1",
        title: "Design Principles",
        durationMin: 34,
        chapters: [
          { id: "4-1-1", name: "Principles of design", topic: "Contrast, hierarchy", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
          { id: "4-1-2", name: "Color & typography", topic: "Choosing palettes & fonts", durationMin: 10, videoUrl: "https://youtu.be/QKxTMgdsaZU?si=wVoTpraaIOCLr-B9" },
          { id: "4-1-3", name: "Spacing & layout", topic: "Grids & rhythm", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
        ]
      },
      {
        id: "4-2",
        title: "Wireframing & Prototyping",
        durationMin: 42,
        chapters: [
          { id: "4-2-1", name: "Low-fidelity wireframes", topic: "Structure & flow", durationMin: 14, videoUrl: "https://youtu.be/QKxTMgdsaZU?si=wVoTpraaIOCLr-B9" },
          { id: "4-2-2", name: "High-fidelity mockups", topic: "Visual design & polish", durationMin: 16, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
          { id: "4-2-3", name: "Interactive prototypes", topic: "User testing & feedback", durationMin: 12, videoUrl: "https://youtu.be/QKxTMgdsaZU?si=wVoTpraaIOCLr-B9" }
        ]
      },
      {
        id: "4-3",
        title: "User Research",
        durationMin: 30,
        chapters: [
          { id: "4-3-1", name: "Interviews", topic: "Question design & moderation", durationMin: 12, videoUrl: "https://youtu.be/QKxTMgdsaZU?si=wVoTpraaIOCLr-B9" },
          { id: "4-3-2", name: "Usability testing", topic: "Tasks & analysis", durationMin: 18, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
        ]
      }
    ]
  },

  {
    id: 5,
    name: "Next.js Deep Dive",
    teacher: "Liam Smith",
    image: HC5,
    rating: 4.6,
    isFree: true,
    price: null,
    overview: "Master Next.js framework with server-side rendering, static site generation, and API routes. Build production-ready React applications with optimized performance, SEO benefits, and seamless deployment on Vercel and other platforms.",
    lectures: [
      {
        id: "5-1",
        title: "Next.js Basics",
        durationMin: 28,
        chapters: [
          { id: "5-1-1", name: "Pages & routing", topic: "File-based routing", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=mTz0GXj8NN0" },
          { id: "5-1-2", name: "Data fetching", topic: "getStaticProps & getServerSideProps", durationMin: 18, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
        ]
      },
      {
        id: "5-2",
        title: "API Routes & Middleware",
        durationMin: 36,
        chapters: [
          { id: "5-2-1", name: "API routes", topic: "Serverless endpoints", durationMin: 16, videoUrl: "https://www.youtube.com/watch?v=mTz0GXj8NN0" },
          { id: "5-2-2", name: "Middleware", topic: "Edge & routing control", durationMin: 20, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
        ]
      },
      {
        id: "5-3",
        title: "Performance & Optimization",
        durationMin: 32,
        chapters: [
          { id: "5-3-1", name: "Image optimization", topic: "Next Image component", durationMin: 12, videoUrl: "https://www.youtube.com/watch?v=mTz0GXj8NN0" },
          { id: "5-3-2", name: "Bundle analysis", topic: "Reducing bundle size", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
          { id: "5-3-3", name: "Deployment strategies", topic: "Vercel & other platforms", durationMin: 10, videoUrl: "https://www.youtube.com/watch?v=mTz0GXj8NN0" }
        ]
      }
    ]
  },

  {
    id: 6,
    name: "Python for Data Science",
    teacher: "Isabella Brown",
    image: HC6,
    rating: 4.5,
    isFree: true,
    price: null,
    overview: "Start your data science journey with Python. Learn data manipulation with pandas, visualization with Matplotlib and Seaborn, and basic statistical analysis. Perfect for beginners interested in data analysis, business intelligence, and data-driven decision making.",
    lectures: [
      {
        id: "6-1",
        title: "Python Fundamentals",
        durationMin: 42,
        chapters: [
          { id: "6-1-1", name: "Python syntax", topic: "Variables, control flow", durationMin: 16, videoUrl: "https://youtu.be/O6dlFgal1Lg?si=Xf9YHtUwwthSP444" },
          { id: "6-1-2", name: "Data structures", topic: "Lists, dicts, sets", durationMin: 14, videoUrl: "https://youtu.be/dB9iEqsLLcM?si=WbThPTaG9Zss2nSi" },
          { id: "6-1-3", name: "Functions & modules", topic: "Reusable code", durationMin: 12, videoUrl: "https://youtu.be/vvCcEGNXsAc?si=xpNfQp0tB7NWFeaj" }
        ]
      },
      {
        id: "6-2",
        title: "pandas & Data Wrangling",
        durationMin: 46,
        chapters: [
          { id: "6-2-1", name: "Intro to pandas", topic: "Series & DataFrames", durationMin: 16, videoUrl: "https://youtu.be/dB9iEqsLLcM?si=WbThPTaG9Zss2nSi" },
          { id: "6-2-2", name: "Cleaning data", topic: "Missing values & transforms", durationMin: 15, videoUrl: "https://youtu.be/1t6bc3QbTx4?si=oMBiU-E0ldO-HsWN" },
          { id: "6-2-3", name: "Data aggregation", topic: "GroupBy & pivot tables", durationMin: 15, videoUrl: "https://youtu.be/dB9iEqsLLcM?si=WbThPTaG9Zss2nSi" }
        ]
      },
      {
        id: "6-3",
        title: "Data Visualization",
        durationMin: 38,
        chapters: [
          { id: "6-3-1", name: "Matplotlib basics", topic: "Plots & customization", durationMin: 14, videoUrl: "https://youtu.be/1t6bc3QbTx4?si=oMBiU-E0ldO-HsWN" },
          { id: "6-3-2", name: "Seaborn for stats", topic: "Statistical plotting", durationMin: 12, videoUrl: "https://youtu.be/vvCcEGNXsAc?si=xpNfQp0tB7NWFeaj" },
          { id: "6-3-3", name: "Plotly interactive", topic: "Web-based visualizations", durationMin: 12, videoUrl: "https://youtu.be/O6dlFgal1Lg?si=Xf9YHtUwwthSP444" }
        ]
      }
    ]
  },

  {
    id: 7,
    name: "Python for Data Science (Advance)",
    teacher: "Isabella Brown",
    image: HC7,
    rating: 4.5,
    isFree: false,
    price: { original: 190, sale: 95 },
    overview: "Advanced data science techniques including machine learning, feature engineering, and model deployment. Dive deep into scikit-learn, build production-ready pipelines, and learn MLOps fundamentals for real-world data science applications.",
    lectures: [
      {
        id: "7-1",
        title: "Advanced pandas",
        durationMin: 38,
        chapters: [
          { id: "7-1-1", name: "Performance tips", topic: "Vectorization & memory", durationMin: 12, videoUrl: "https://youtu.be/YCrSjxIfDcI?si=ej1DX6xjxWqhVBu_" },
          { id: "7-1-2", name: "Time series", topic: "Resampling & windows", durationMin: 14, videoUrl: "https://youtu.be/ZuHMuvIo7P4?si=gyMY-TPqRgwMdNRt" },
          { id: "7-1-3", name: "Advanced indexing", topic: "MultiIndex & querying", durationMin: 12, videoUrl: "https://youtu.be/YCrSjxIfDcI?si=ej1DX6xjxWqhVBu_" }
        ]
      },
      {
        id: "7-2",
        title: "Feature Engineering",
        durationMin: 46,
        chapters: [
          { id: "7-2-1", name: "Feature creation", topic: "Deriving signals", durationMin: 18, videoUrl: "https://youtu.be/YCrSjxIfDcI?si=ej1DX6xjxWqhVBu_" },
          { id: "7-2-2", name: "Scaling & encoding", topic: "Normalization & encoders", durationMin: 14, videoUrl: "https://youtu.be/ZuHMuvIo7P4?si=gyMY-TPqRgwMdNRt" },
          { id: "7-2-3", name: "Feature selection", topic: "Statistical methods", durationMin: 14, videoUrl: "https://youtu.be/YCrSjxIfDcI?si=ej1DX6xjxWqhVBu_" }
        ]
      },
      {
        id: "7-3",
        title: "Machine Learning Pipeline",
        durationMin: 52,
        chapters: [
          { id: "7-3-1", name: "Model training", topic: "Cross-validation & metrics", durationMin: 18, videoUrl: "https://youtu.be/ZuHMuvIo7P4?si=gyMY-TPqRgwMdNRt" },
          { id: "7-3-2", name: "Hyperparameter tuning", topic: "Grid search & Bayesian", durationMin: 16, videoUrl: "https://youtu.be/YCrSjxIfDcI?si=ej1DX6xjxWqhVBu_" },
          { id: "7-3-3", name: "Model deployment", topic: "APIs & monitoring", durationMin: 18, videoUrl: "https://youtu.be/ZuHMuvIo7P4?si=gyMY-TPqRgwMdNRt" }
        ]
      }
    ]
  },

  {
    id: 8,
    name: " JavaScript (Alternate)",
    teacher: "Noah Johnson",
    image: HC8,
    rating: 4.7,
    isFree: false,
    price: { original: 180, sale: 89 },
    overview: "Alternative fullstack curriculum focusing on TypeScript, modern testing strategies, and advanced React patterns. Learn enterprise-level application architecture, microservices, and cloud deployment with AWS or Google Cloud Platform.",
    lectures: [
      {
        id: "8-1",
        title: "Modern Frontend",
        durationMin: 48,
        chapters: [
          { id: "8-1-1", name: "React patterns", topic: "Composition & hooks", durationMin: 18, videoUrl: "https://youtu.be/48iVEbvT7u4?si=StHwMSCby-BrefhI" },
          { id: "8-1-2", name: "State libs", topic: "Redux & Zustand", durationMin: 16, videoUrl: "https://youtu.be/2LrbDDTgTU0?si=iZIpUpgOw14Mb0bt" },
          { id: "8-1-3", name: "Testing", topic: "Unit & integration", durationMin: 14, videoUrl: "https://youtu.be/I6YcroaALcw?si=8-MdVIxyDCJPI2gg" }
        ]
      },
      {
        id: "8-2",
        title: "Backend Architecture",
        durationMin: 44,
        chapters: [
          { id: "8-2-1", name: "Microservices", topic: "Design & communication", durationMin: 16, videoUrl: "https://youtu.be/48iVEbvT7u4?si=StHwMSCby-BrefhI" },
          { id: "8-2-2", name: "Database design", topic: "Scalability & performance", durationMin: 14, videoUrl: "https://youtu.be/2LrbDDTgTU0?si=iZIpUpgOw14Mb0bt" },
          { id: "8-2-3", name: "Caching strategies", topic: "Redis & CDN", durationMin: 14, videoUrl: "https://youtu.be/I6YcroaALcw?si=8-MdVIxyDCJPI2gg" }
        ]
      },
      {
        id: "8-3",
        title: "Cloud & DevOps",
        durationMin: 38,
        chapters: [
          { id: "8-3-1", name: "Containerization", topic: "Docker & Kubernetes", durationMin: 14, videoUrl: "https://youtu.be/48iVEbvT7u4?si=StHwMSCby-BrefhI" },
          { id: "8-3-2", name: "CI/CD pipelines", topic: "Automated testing & deployment", durationMin: 12, videoUrl: "https://youtu.be/2LrbDDTgTU0?si=iZIpUpgOw14Mb0bt" },
          { id: "8-3-3", name: "Monitoring & logging", topic: "Production observability", durationMin: 12, videoUrl: "https://youtu.be/I6YcroaALcw?si=8-MdVIxyDCJPI2gg" }
        ]
      }
    ]
  }
];

export default coursesData;