export const homeContent = {
  meta: {
    title: "Gavriel Rudolph - Tech Professional",
    description:
      "Full-stack developer specialized in web development, AI, and automation solutions.",
  },

  hero: {
    headline: "Problem solver. Code writer. AI enthusiast.",
    subheadline: "Building digital solutions that <em>actually work</em>",
    ctaText: "LET'S TALK",
    ctaLink: "/contact",
    imageSrc: "/images/profilepic.jpg", // Modern tech aesthetic
    imageAlt:
      "Tech visualization with light trails representing digital solutions",
  },

  about: {
    heading: "What I'm about",
    content: `I enjoy turning <span class="text-emphasis accent-secondary">complex problems</span> into <span class="text-emphasis accent-warm">simple, elegant solutions</span>. After completing <strong>CodeBoxx Academy's</strong> <span class="underline-accent">Full Stack program</span>, I started building tools that make a <span class="text-emphasis">real difference</span> for clients.

    <p>When I'm not coding for work, I'm studying <span class="underline-warm">Data Science at Open University</span> or <em>coaching new developers</em> at CodeBoxx's <strong>AI bootcamp</strong>.</p>

    <p>My approach? <span class="text-emphasis accent-contrast">Understand the actual problem first</span>, then build something that solves it without unnecessary complications.</p>`,
    ctaText: "MORE ABOUT ME",
    ctaLink: "/about",
    imageSrc: "/images/cheekyselfie.png",
    imageAlt: "Gavriel Rudolph, tech professional",
  },

  services: {
    heading: "How I can help",
    introduction:
      "I offer services in <strong>development</strong>, <strong>automation</strong>, and <strong>tech strategy</strong>. Nothing fancy—just solid work that delivers what you need.",
    ctaText: "SEE ALL SERVICES",
    ctaLink: "/services",
    items: [
      {
        id: "ai-automation",
        number: "01",
        title: "AI & Automation",
        description:
          "Let's put <em>AI to work</em> on your <strong>actual business problems</strong>. No buzzwords or empty promises—just <span class=\"text-emphasis\">practical tools</span> that automate repetitive tasks and help you make better decisions with your data.",
        iconSrc: "/images/ai.jpg",
        link: "/services#ai-automation",
      },
      {
        id: "web-development",
        number: "02",
        title: "Websites & Web Apps",
        description:
          "I build websites that <em>do more than look pretty</em>. Whether you need <strong>e-commerce</strong>, <strong>booking systems</strong>, or <strong>custom tools</strong>, I focus on what brings <span class=\"text-emphasis\">value to your business</span> and your customers.",
        iconSrc: "/images/design-drawing-on-tablet.jpg",
        link: "/services#web-development",
      },
      {
        id: "performance",
        number: "03",
        title: "Performance Improvements",
        description:
          "Got a <em>slow website</em> or <em>clunky system</em>? I'll find what's causing the issues and <strong>fix them</strong>. Better performance means <span class=\"text-emphasis\">happier users</span> and <span class=\"text-emphasis\">better business results</span>.",
        iconSrc: "/images/network.jpg",
        link: "/services#performance",
      },
    ],
  },

  portfolio: {
    heading: "Some recent work",
    introduction:
      "Here are a few projects I've worked on lately. Each one started with a <em>specific problem</em> that needed solving.",
    ctaText: "SEE MORE PROJECTS",
    ctaLink: "/portfolio",
    projects: [
      {
        id: "prodai",
        title: "Prodai - Productivity App",
        description:
          "Helps teams <strong>stay organized</strong> with smart task recommendations. Built with <span class=\"text-code\">React</span>, <span class=\"text-code\">FastAPI</span>, and some clever <span class=\"text-emphasis\">AI bits</span> to make workflow management less painful.",
        imageSrc: "/images/prodai.png",
        link: "/portfolio/prodai",
      },
      {
        id: "clinical-trials",
        title: "Clinical Trials Dashboard",
        description:
          "Turns <em>complicated medical data</em> into <strong>clear visuals</strong> that healthcare teams can actually use. <span class=\"text-emphasis\">No more spreadsheet headaches</span>.",
        imageSrc: "/images/data-graphic.jpg",
        link: "/portfolio/clinical-trials",
      },
      {
        id: "food-delivery",
        title: "Rocket Food Delivery App",
        description:
          "A mobile app that makes ordering and tracking food deliveries <strong>straightforward</strong> for both <em>customers</em> and <em>restaurants</em>.",
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
          "Gavriel <strong>understood what we needed</strong> and built exactly that, without overcomplicating things. He <em>explained technical concepts</em> in ways that made sense to our team, and the dashboard he created has become something we use <span class=\"text-emphasis\">every day</span>.",
        author: "Sarah",
        role: "Operations Director",
        result:
          "Their team now processes reports in <strong>hours instead of days</strong>, with <em>fewer errors</em> and <span class=\"text-emphasis\">better insights</span>.",
      },
    ],
  },

  blog: {
    heading: "Things I've learned along the way",
    introduction:
      "Occasional writings about <strong>tech</strong>, <strong>development</strong>, and <strong>AI</strong> based on <em>real projects</em> and <em>problems I've tackled</em>.",
    ctaText: "READ MORE",
    ctaLink: "/blog",
    posts: [
      {
        id: "practical-ai",
        title: "Practical AI for Small Businesses (Without Breaking the Bank)",
        excerpt:
          "Ways smaller companies can use <strong>AI tools</strong> without needing enterprise-level budgets or expertise.",
        readTime: "7 min read",
        imageSrc: "/images/ai.jpg",
        link: "/blog/practical-ai",
      },
      {
        id: "reusable-components",
        title: "Building Components That Don't Fall Apart Later",
        excerpt:
          "Lessons from building <em>reusable code</em> that still works when projects <strong>grow bigger</strong> than expected.",
        readTime: "9 min read",
        imageSrc: "/images/design-drawing-on-tablet.jpg",
        link: "/blog/reusable-components",
      },
      {
        id: "data-insights",
        title: "Making Sense of Your Data (And Actually Using It)",
        excerpt:
          "A straightforward guide to setting up <strong>analytics</strong> and turning <em>numbers into actions</em>.",
        readTime: "11 min read",
        imageSrc: "/images/data-graphic.jpg",
        link: "/blog/data-insights",
      },
    ],
  },

  cta: {
    heading: "Let's work together",
    content:
      "Have a project in mind? I'm <strong>straightforward to work with</strong>—clear communication, honest feedback, and focused on getting results. Whether you need something built from scratch or want to improve what you have, <em>let's start with a conversation</em>.",
    ctaText: "GET IN TOUCH",
    ctaLink: "/contact",
    availability: "<span class=\"text-emphasis\">Available</span> for new projects starting June 2025.",
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
