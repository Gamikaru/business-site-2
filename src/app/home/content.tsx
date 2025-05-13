export const homeContent = {
  meta: {
    title: "Gavriel Rudolph - Tech Professional",
    description:
      "Full-stack developer specialized in web development, AI, and automation solutions.",
  },

  hero: {
    headline: "Problem solver. Code writer. AI enthusiast.",
    subheadline: "Building digital solutions that actually work",
    ctaText: "LET'S TALK",
    ctaLink: "/contact",
    imageSrc: "/images/cool_tunnel.jpg", // Modern tech aesthetic
    imageAlt:
      "Tech visualization with light trails representing digital solutions",
  },

  about: {
    heading: "What I'm about",
    content: `I enjoy turning complex problems into simple, elegant solutions. After completing CodeBoxx Academy's Full Stack program, I started building tools that make a real difference for clients. When I'm not coding for work, I'm studying Data Science at Open University or coaching new developers at CodeBoxx's AI bootcamp.

    My approach? Understand the actual problem first, then build something that solves it without unnecessary complications.`,
    ctaText: "MORE ABOUT ME",
    ctaLink: "/about",
    imageSrc: "/images/profilepic.jpg",
    imageAlt: "Gavriel Rudolph, tech professional",
  },

  services: {
    heading: "How I can help",
    introduction:
      "I offer services in development, automation, and tech strategy. Nothing fancy—just solid work that delivers what you need.",
    ctaText: "SEE ALL SERVICES",
    ctaLink: "/services",
    items: [
      {
        id: "ai-automation",
        number: "01",
        title: "AI & Automation",
        description:
          "Let's put AI to work on your actual business problems. No buzzwords or empty promises—just practical tools that automate repetitive tasks and help you make better decisions with your data.",
        iconSrc: "/images/ai.jpg",
        link: "/services#ai-automation",
      },
      {
        id: "web-development",
        number: "02",
        title: "Websites & Web Apps",
        description:
          "I build websites that do more than look pretty. Whether you need e-commerce, booking systems, or custom tools, I focus on what brings value to your business and your customers.",
        iconSrc: "/images/design-drawing-on-tablet.jpg",
        link: "/services#web-development",
      },
      {
        id: "performance",
        number: "03",
        title: "Performance Improvements",
        description:
          "Got a slow website or clunky system? I'll find what's causing the issues and fix them. Better performance means happier users and better business results.",
        iconSrc: "/images/network.jpg",
        link: "/services#performance",
      },
    ],
  },

  portfolio: {
    heading: "Some recent work",
    introduction:
      "Here are a few projects I've worked on lately. Each one started with a specific problem that needed solving.",
    ctaText: "SEE MORE PROJECTS",
    ctaLink: "/portfolio",
    projects: [
      {
        id: "prodai",
        title: "Prodai - Productivity App",
        description:
          "Helps teams stay organized with smart task recommendations. Built with React, FastAPI, and some clever AI bits to make workflow management less painful.",
        imageSrc: "/images/prodai.png",
        link: "/portfolio/prodai",
      },
      {
        id: "clinical-trials",
        title: "Clinical Trials Dashboard",
        description:
          "Turns complicated medical data into clear visuals that healthcare teams can actually use. No more spreadsheet headaches.",
        imageSrc: "/images/data-graphic.jpg",
        link: "/portfolio/clinical-trials",
      },
      {
        id: "food-delivery",
        title: "Rocket Food Delivery App",
        description:
          "A mobile app that makes ordering and tracking food deliveries straightforward for both customers and restaurants.",
        imageSrc: "/images/mobile-dev.jpg",
        link: "/portfolio/food-delivery",
      },
    ],
  },

  testimonials: {
    heading: "What clients say",
    items: [
      {
        id: "testimonial-1",
        quote:
          "Gavriel understood what we needed and built exactly that, without overcomplicating things. He explained technical concepts in ways that made sense to our team, and the dashboard he created has become something we use every day.",
        author: "Sarah",
        role: "Operations Director",
        result:
          "Their team now processes reports in hours instead of days, with fewer errors and better insights.",
      },
    ],
  },

  blog: {
    heading: "Things I've learned along the way",
    introduction:
      "Occasional writings about tech, development, and AI based on real projects and problems I've tackled.",
    ctaText: "READ MORE",
    ctaLink: "/blog",
    posts: [
      {
        id: "practical-ai",
        title: "Practical AI for Small Businesses (Without Breaking the Bank)",
        excerpt:
          "Ways smaller companies can use AI tools without needing enterprise-level budgets or expertise.",
        readTime: "7 min read",
        imageSrc: "/images/ai.jpg",
        link: "/blog/practical-ai",
      },
      {
        id: "reusable-components",
        title: "Building Components That Don't Fall Apart Later",
        excerpt:
          "Lessons from building reusable code that still works when projects grow bigger than expected.",
        readTime: "9 min read",
        imageSrc: "/images/design-drawing-on-tablet.jpg",
        link: "/blog/reusable-components",
      },
      {
        id: "data-insights",
        title: "Making Sense of Your Data (And Actually Using It)",
        excerpt:
          "A straightforward guide to setting up analytics and turning numbers into actions.",
        readTime: "11 min read",
        imageSrc: "/images/data-graphic.jpg",
        link: "/blog/data-insights",
      },
    ],
  },

  cta: {
    heading: "Let's work together",
    content:
      "Have a project in mind? I'm straightforward to work with—clear communication, honest feedback, and focused on getting results. Whether you need something built from scratch or want to improve what you have, let's start with a conversation.",
    ctaText: "GET IN TOUCH",
    ctaLink: "/contact",
    availability: "Available for new projects starting June 2025.",
  },

  newsletter: {
    heading: "The Digital Edge Newsletter",
    description:
      "Monthly tech and development insights without the fluff. Practical tips you can actually use.",
    buttonText: "SIGN UP",
    privacyText: "I don't share your email with anyone. Unsubscribe anytime.",
  },

  footer: {
    tagline: "Working from Tampa, helping clients worldwide",
    message:
      "Got a problem that needs solving? Send me a message and I'll get back to you within a day.",
  },
};

export default homeContent;
