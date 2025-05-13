export const portfolioContent = {
  meta: {
    title: "Portfolio - Gavriel Rudolph",
    description: "Projects and case studies showcasing my development and design work.",
  },

  overview: {
    headline: "Projects with <span class=\"text-emphasis\">purpose</span>",
    introduction: "Here's a selection of my recent work. Each project began with a <strong>specific challenge</strong> that needed solving—whether it was <em>streamlining workflows</em>, <em>visualizing complex data</em>, or <em>creating better user experiences</em>. Take a look at how I approached these problems and the results we achieved.",
    imageSrc: "/images/lights_nodes.jpg",
    imageAlt: "Portfolio showcase visualization with connected nodes",
  },

  filters: [
    { id: "all", label: "All" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Applications" },
    { id: "ai", label: "AI & Automation" },
    { id: "data", label: "Data & Analytics" },
    { id: "ux", label: "UX/UI Design" },
    { id: "cloud", label: "Cloud & Infrastructure" },
  ],

  projects: [
    {
      id: "prodai",
      title: "<span class=\"project-title\">Prodai - AI-Powered Productivity App</span>",
      shortDescription: "A <strong>smart productivity tool</strong> that helps teams stay organized with <em>AI-driven recommendations</em>.",
      longDescription: "Prodai tackles a common problem: <span class=\"text-emphasis\">information overload</span> and <span class=\"text-emphasis\">task management burnout</span>. This app uses AI to analyze work patterns and provide personalized task and schedule recommendations that actually make sense.\n\n<p>The challenge was creating something that felt <strong>intuitive</strong> rather than <strong>intrusive</strong>. By focusing on useful suggestions instead of constant notifications, Prodai helps teams prioritize work more effectively and reduces the mental load of decision-making throughout the day.</p>\n\n<p>Built with <span class=\"text-code\">React</span> and <span class=\"text-code\">FastAPI</span>, with AI components powered by <span class=\"text-code\">OpenAI</span>, the system is designed to scale smoothly as user needs grow. The clean, distraction-free interface puts the focus on getting things done rather than managing the app itself.</p>",
      results: [
        "<mark>27% reduction</mark> in missed deadlines reported by initial users",
        "Seamless integration with <strong>existing workflow tools</strong>",
        "Positive feedback on the <em>\"surprisingly useful\"</em> recommendation engine"
      ],
      techStack: ["React", "FastAPI", "PostgreSQL", "OpenAI GPT", "PyTest", "Docker"],
      categories: ["web", "ai", "cloud"],
      imageSrc: "/images/20250325_1149_Digital Workspace Harmony_simple_compose_01jq6zwqa5f7v9j29rzybgyzrh.gif",
      imageAlt: "Prodai application interface showing task recommendations",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/prodai",
      featured: true
    },
    {
      id: "clinical-trials-dashboard",
      title: "Clinical Trials Dashboard",
      shortDescription: "An interactive dashboard that transforms complex clinical data into clear, actionable insights.",
      longDescription: "Healthcare professionals were struggling with mountains of clinical trial data trapped in spreadsheets and legacy systems. This dashboard brings that information to life through intuitive visualizations that help teams make better decisions faster.\n\nThe project required careful attention to data security while maintaining performance with large datasets. Using React and Chart.js on the frontend with a FastAPI backend, we created a responsive system that works across devices and presents complex information in an accessible way.\n\nThe real success came from spending time understanding how the data would actually be used day-to-day, then designing visualizations that answered the most important questions without overwhelming users with unnecessary details.",
      results: [
        "Reduced time spent on manual report generation by 68%",
        "Improved data accuracy by eliminating manual data transfer steps",
        "Enabled quicker identification of trial progress issues"
      ],
      techStack: ["React", "Chart.js", "TypeScript", "FastAPI", "Pandas", "Docker", "TailwindCSS"],
      categories: ["web", "data"],
      imageSrc: "/images/data-graphic.jpg",
      imageAlt: "Clinical trials data visualization dashboard",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/clinical-trials-dashboard",
      featured: true
    },
    {
      id: "rocket-food",
      title: "Rocket Food Delivery App",
      shortDescription: "A real-time mobile solution that makes food ordering and delivery tracking simple for everyone involved.",
      longDescription: "This mobile app was built to address the frustrations of both customers and restaurants in the food delivery process. The goal was to create something more direct than third-party platforms while providing real-time visibility into order status.\n\nUsing React Native and Expo, we built a cross-platform solution that works smoothly on both iOS and Android. The app features live order tracking, easy menu customization for restaurants, and a streamlined checkout process that remembers user preferences.\n\nWhat sets this project apart is how it balances the needs of different users—giving customers the convenience they expect while providing restaurants with better control over their digital presence and delivery operations.",
      results: [
        "Reduced third-party delivery commissions by 28% for partner restaurants",
        "Increased repeat orders by 42% compared to previous system",
        "Decreased order errors through better communication tools"
      ],
      techStack: ["React Native", "Expo", "Ruby", "Node.js", "TailwindCSS"],
      categories: ["mobile"],
      imageSrc: "/images/20250325_1149_Modern Cafe Browsing_simple_compose_01jq6zx2ymedzr97shffc61p94.gif",
      imageAlt: "Rocket Food mobile app interface showing order tracking",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/rocket-food",
      featured: true
    },
    {
      id: "blogd",
      title: "Blogd - Feature-Rich Blogging Platform",
      shortDescription: "A clean, secure platform that makes content creation and management straightforward.",
      longDescription: "Blogd was created for content creators who needed more flexibility than standard blogging platforms without the technical complexity of custom solutions. Security and ease of use were top priorities from the start.\n\nThe platform supports multimedia uploads and includes robust security features while maintaining a clean, distraction-free writing environment. Built with React and Express with MongoDB for data storage, the system is designed to be fast and reliable even as content libraries grow.\n\nSpecial attention was paid to the editing experience, with a focus on making writing feel natural and reducing the friction between idea and published piece. The result is a platform that stays out of the way while providing the tools creators need.",
      results: [
        "23% increase in publishing frequency for beta users",
        "Strong positive feedback on the editor interface",
        "Solid security architecture with zero vulnerabilities in initial testing"
      ],
      techStack: ["React", "Sass", "Express", "MongoDB", "JWT", "Cloudinary", "Formik/Yup"],
      categories: ["web", "ux"],
      imageSrc: "/images/blogd.jpg",
      imageAlt: "Blogd platform content editor interface",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/blogd",
      featured: false
    },
    {
      id: "theme-switcher",
      title: "Automated Theme Switcher",
      shortDescription: "A desktop utility that adjusts your Windows theme to match your daily routine—no more manual switching.",
      longDescription: "This straightforward desktop app solves a small but persistent annoyance: manually switching between light and dark themes throughout the day. It automatically adjusts your Windows theme based on time, location, or custom triggers you define.\n\nBuilt with Python and CustomTkinter, the application runs quietly in the background with minimal resource usage. The interface is clean and intuitive, focusing on simple setup and reliable operation rather than unnecessary features.\n\nThis project demonstrates that even relatively simple solutions can significantly improve day-to-day experiences when they're designed thoughtfully and execute their primary function well.",
      results: [
        "Consistently positive user feedback on the \"set and forget\" functionality",
        "Low resource usage even with continuous background operation",
        "Expanded to include additional customization options based on user requests"
      ],
      techStack: ["Python", "CustomTkinter", "Windows Registry", "unittest"],
      categories: ["desktop"],
      imageSrc: "/images/theme-switcher.jpg",
      imageAlt: "Theme Switcher application interface",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/theme-switcher",
      featured: false
    },
    {
      id: "back-office",
      title: "Back Office Management System",
      shortDescription: "A comprehensive business management platform that streamlines operations and visualizes performance.",
      longDescription: "This back-office system was built for a company struggling with disconnected tools and manual processes for tracking business operations. The challenge was unifying data from multiple sources while creating an interface that would work for both technical and non-technical team members.\n\nUsing React and Node.js with MongoDB, we created a centralized system for tracking transactions, managing team activities, and visualizing key metrics. The dashboard provides real-time insights that help management make more informed decisions more quickly.\n\nSecurity was a major focus, with comprehensive authentication and authorization systems ensuring that sensitive business data remains protected while still being accessible to those who need it.",
      results: [
        "Reduced report generation time from days to minutes",
        "Improved data accuracy by eliminating manual transfers between systems",
        "Enhanced decision-making through accessible, real-time performance metrics"
      ],
      techStack: ["React", "Node.js", "MongoDB", "JWT", "Chart.js"],
      categories: ["web", "data"],
      imageSrc: "/images/back-office.jpg",
      imageAlt: "Back Office Management System dashboard",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/back-office",
      featured: false
    },
    {
      id: "devops-testing",
      title: "DevOps & Performance Testing Project",
      shortDescription: "A testing framework that ensures digital platforms run smoothly and efficiently.",
      longDescription: "This project addressed the challenge of maintaining consistent performance and reliability across a growing digital platform. Rather than waiting for issues to emerge, we implemented automated testing and performance monitoring that identifies potential problems before users ever encounter them.\n\nUsing tools like Selenium, Lighthouse, and Jest within CI/CD pipelines, the system runs comprehensive tests with each update and provides clear feedback on performance metrics and potential issues. This proactive approach has significantly reduced emergency fixes and improved overall platform stability.\n\nWhat makes this project particularly effective is how it translates technical metrics into business impact, helping non-technical stakeholders understand the value of performance improvements and prioritize resources accordingly.",
      results: [
        "47% reduction in production bugs after implementation",
        "31% improvement in overall platform performance",
        "Better prioritization of development resources based on actual usage patterns"
      ],
      techStack: ["React", "Sass", "Selenium", "Lighthouse", "Jest"],
      categories: ["ai", "cloud"],
      imageSrc: "/images/devops-testing.jpg",
      imageAlt: "DevOps testing dashboard showing performance metrics",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/devops-testing",
      featured: false
    },
    {
      id: "courier-system",
      title: "Courier Management System - Java Backend",
      shortDescription: "A robust backend system for managing logistics and delivery operations efficiently.",
      longDescription: "This Java-based backend system was developed to streamline logistics for a courier company facing challenges with route optimization and order tracking. The goal was creating a reliable foundation that could handle increasing delivery volumes without performance degradation.\n\nBuilt with Spring Boot and Hibernate, the system manages everything from order entry to delivery confirmation, with APIs that connect smoothly to both internal tools and customer-facing applications. Comprehensive testing with JUnit and Mockito ensures reliability even under heavy loads.\n\nThe most significant aspect of this project was designing a system architecture that accommodates both current needs and future growth, providing a solid technical foundation that continues to serve the business as operations expand.",
      results: [
        "Supported 300% growth in daily deliveries without performance issues",
        "Reduced delivery planning time by 62%",
        "Improved customer satisfaction through better delivery time estimates"
      ],
      techStack: ["Java", "Spring Boot", "Hibernate", "MySQL", "JUnit", "Mockito"],
      categories: ["web", "cloud"],
      imageSrc: "/images/courier-system.jpg",
      imageAlt: "Courier management system interface",
      ctaText: "View Project Details",
      ctaLink: "/portfolio/courier-system",
      featured: false
    }
  ],

  projectRequest: {
    heading: "Have a project in mind?",
    content: "If you're looking for solutions to <strong>similar challenges</strong>—or facing something <strong>completely different</strong>—I'd be happy to discuss how I can help. My approach always starts with <span class=\"text-emphasis\">understanding your specific needs</span> before recommending any technical solution.",
    ctaText: "Let's Discuss Your Project",
    ctaLink: "/contact?topic=project"
  },

  clientExperience: {
    heading: "Working with clients across industries",
    industries: [
      "Healthcare & Medical",
      "Logistics & Supply Chain",
      "Food & Hospitality",
      "Professional Services",
      "E-commerce",
      "Technology Startups"
    ],
    testimonial: {
      quote: "What impressed me most was how quickly Gavriel <strong>understood our business challenges</strong>, not just our technical requirements. He built <em>exactly what we needed</em> without overcomplicating things or adding unnecessary features.",
      author: "Michael R.",
      role: "Operations Manager"
    }
  },

  conclusion: {
    heading: "Every project tells a <span class=\"text-emphasis\">story</span>",
    content: "These examples represent a range of technical approaches, but they share a common thread: they were all built to <strong>solve specific problems</strong> and deliver <strong>practical value</strong>. Whether you need something entirely new or want to improve existing systems, I bring the same <span class=\"text-emphasis\">focused approach</span> to understanding challenges and building effective solutions.",
    ctaText: "Start a Conversation",
    ctaLink: "/contact"
  }
};

export default portfolioContent;
