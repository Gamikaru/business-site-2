export const servicesContent = {
  meta: {
    title: "Services - Gavriel Rudolph",
    description: "Professional development, AI, and technical consulting services.",
  },

  overview: {
    headline: "Practical digital solutions for <em>real business challenges</em>",
    introduction: "I provide <strong>focused services</strong> that address specific business needs—whether you're looking to <span class=\"text-emphasis\">build something new</span>, <span class=\"text-emphasis\">improve what you have</span>, or <span class=\"text-emphasis\">leverage technology more effectively</span>. Each service is tailored to deliver <em>tangible results</em> without unnecessary complexity.",
    imageSrc: "/images/abstract-lights-2.jpg",
    imageAlt: "Abstract technical visualization representing digital solutions",
  },

  services: [
    {
      id: "ai-automation",
      name: "AI Integration & Automation",
      headline: "<span class=\"gradient-text\">AI-Powered Business Automation</span>",
      introduction: "Put <strong>practical AI</strong> to work solving your everyday business problems. <em>No buzzwords or empty promises</em>—just targeted solutions that <span class=\"text-emphasis\">save time</span>, <span class=\"text-emphasis\">reduce errors</span>, and help you <span class=\"text-emphasis\">make better decisions</span> with your data.",
      imageSrc: "/images/ai.jpg",
      imageDarkSrc: "/images/data-graphic.jpg",
      benefits: [
        "<strong>Task Automation</strong> — Turn repetitive, manual processes into automated workflows that free up your team for more valuable work.",
        "<strong>Customer Interactions</strong> — Create more personalized experiences with AI-powered recommendations and assistance.",
        "<strong>Data Insights</strong> — Transform raw information into actionable business intelligence that guides better decisions.",
        "<strong>Accessible Implementation</strong> — Implement AI solutions without enterprise-level complexity or cost."
      ],
      process: [
        "<strong>Opportunity Discovery</strong> — We identify where AI can deliver the <em>biggest impact</em> for your specific business.",
        "<strong>Solution Design</strong> — I create AI solutions that <em>align with your goals</em> and work within your existing systems.",
        "<strong>Implementation</strong> — Building and training AI systems using your <em>unique data and processes</em>.",
        "<strong>Integration</strong> — Embedding AI into your workflows with <em>minimal disruption</em> to your team."
      ],
      example: "A Tampa logistics company was spending hours manually generating reports. I built a <span class=\"text-emphasis\">lightweight AI assistant</span> that automated the process, resulting in <strong>30% fewer manual tickets</strong> and an <strong>18% improvement in delivery times</strong>. The entire solution was implemented within <mark>48 hours</mark>.",
      pricing: {
        starter: "<strong>$1,500</strong> — AI Opportunity Assessment",
        standard: "<strong>$5,000</strong> — Custom AI Solution Implementation"
      },
      ctaText: "Let's Discuss Your AI Project",
      ctaLink: "/contact?service=ai",
    },
    {
      id: "web-development",
      name: "Web Development",
      headline: "<span class=\"gradient-text\">Custom Business Websites & Web Apps</span>",
      introduction: "I build websites and web applications that <strong>work as hard as you do</strong>. Every element is designed to <em>engage your visitors</em>, <em>showcase your value</em>, and <em>convert browsers into buyers</em>—all while integrating smoothly with your existing business operations.",
      imageSrc: "/images/collaborative-design.jpg",
      imageDarkSrc: "/images/future-tunnel-2.jpg",
      benefits: [
        "<strong>Purpose-Built Design</strong> — Websites tailored to your specific business goals and user needs.",
        "<strong>Business Integration</strong> — Tools that connect directly to your workflow, from booking systems to customer portals.",
        "<strong>Practical Automation</strong> — Save time with automated inquiries, scheduling, and data handling.",
        "<strong>Growth-Ready Foundation</strong> — Built to scale and adapt as your business evolves."
      ],
      process: [
        "<strong>Discovery</strong> — We define <em>goals</em>, <em>audience</em>, and <em>features</em> that will make your website effective.",
        "<strong>Design & Development</strong> — I build a high-performance website or application focused on results.",
        "<strong>Testing & Launch</strong> — Thorough testing ensures everything works as expected before going live.",
        "<strong>Support & Growth</strong> — Ongoing improvements to maximize long-term impact."
      ],
      example: "A local service business was losing leads because their website wasn't mobile-friendly and lacked online booking. I rebuilt their site with <span class=\"text-emphasis\">responsive design</span> and an <span class=\"text-emphasis\">integrated scheduling system</span>, resulting in <strong>40% more appointments</strong> and <strong>significantly reduced phone time</strong> for their staff.",
      pricing: {
        starter: "<strong>$600</strong> — Basic Website",
        standard: "<strong>$1,500</strong> — Business Website with E-commerce or Booking"
      },
      ctaText: "Start Your Web Project",
      ctaLink: "/contact?service=web",
    },
    {
      id: "system-optimization",
      name: "System Optimization",
      headline: "Performance-Driven System Optimization",
      introduction: "Slow websites and inefficient systems cost you customers, revenue, and credibility. I identify and fix the bottlenecks, security vulnerabilities, and usability issues that are holding your digital platforms back.",
      imageSrc: "/images/network.jpg",
      imageDarkSrc: "/images/robot_futuristic.jpg",
      benefits: [
        "Speed Improvements — Pages that load quickly, keeping visitors engaged instead of leaving.",
        "Search Visibility — Performance improvements that help boost your search engine ranking.",
        "User Retention — Smooth, responsive experiences that encourage customers to return.",
        "Security Enhancements — Protection for your data and your reputation."
      ],
      process: [
        "Performance Audit — I identify what's slowing you down and where vulnerabilities exist.",
        "Optimization Plan — We create a prioritized roadmap for improvements with the highest impact.",
        "Implementation — Executing changes with minimal disruption to your operations.",
        "Ongoing Monitoring — Regular analysis to maintain peak performance."
      ],
      example: "An e-commerce site was losing sales because pages took over 8 seconds to load. After optimization, load times dropped to under 2 seconds, leading to a 25% decrease in abandoned carts and a 15% increase in conversion rate.",
      pricing: {
        starter: "$499 — Performance Audit",
        standard: "$1,200 — Complete Performance Optimization"
      },
      ctaText: "Improve Your Digital Performance",
      ctaLink: "/contact?service=optimization",
    },
    {
      id: "tech-consulting",
      name: "Tech Strategy & Consulting",
      headline: "Tech Strategy & Consulting",
      introduction: "Making the right technology decisions is challenging. I help you cut through the noise and choose solutions that align with your business goals—preventing costly mistakes and positioning you for long-term success.",
      imageSrc: "/images/hanging_lightbulbs.jpg",
      imageDarkSrc: "/images/consultingstrat.jpg",
      benefits: [
        "Clear Direction — Straightforward technology recommendations without unnecessary jargon.",
        "Smarter Investment — Informed decisions about where to focus your technology budget.",
        "Risk Reduction — Identify and address potential issues before they impact your business.",
        "Future-Proofing — Build systems that adapt to changing business needs and technologies."
      ],
      process: [
        "Business Analysis — Understanding your goals, challenges, and current technology setup.",
        "Strategy Development — Creating a technology approach aligned with your business vision.",
        "Decision Support — Guiding technology choices with clear pros, cons, and recommendations.",
        "Implementation Planning — Mapping out execution steps that maximize impact and minimize disruption."
      ],
      example: "A healthcare provider was struggling to choose between three competing software platforms. I evaluated each option against their specific needs and workflows, helping them select and implement the right solution—avoiding a potential six-figure mistake.",
      pricing: {
        starter: "$750 — Strategy Session",
        standard: "$3,000 — Comprehensive Technology Roadmap"
      },
      ctaText: "Get Strategic Guidance",
      ctaLink: "/contact?service=consulting",
    },
    {
      id: "mobile-development",
      name: "Mobile App Development",
      headline: "Mobile App Development",
      introduction: "Extend your reach and deepen customer engagement with intuitive, feature-rich mobile applications. I build apps that create meaningful connections with your customers, whether on iOS, Android, or both platforms.",
      imageSrc: "/images/mobile-dev.jpg",
      imageDarkSrc: "/images/cool_tunnel.jpg",
      benefits: [
        "User-Focused Design — Interfaces that feel natural and are enjoyable to use.",
        "Engagement Features — Tools like push notifications that keep users coming back.",
        "Monetization Options — In-app purchases and subscription models done right.",
        "Complete Service — Everything from concept to app store submission and marketing."
      ],
      process: [
        "Planning — We define your app vision, user journeys, and business goals.",
        "Design — Creating intuitive interfaces that users will enjoy engaging with.",
        "Development — Coding and testing across devices for reliability and polish.",
        "Launch & Growth — App store publication and ongoing improvement."
      ],
      example: "A restaurant group wanted to increase repeat business and reduce third-party delivery fees. Their custom ordering app now drives 35% of their delivery business directly, eliminating commission fees and improving customer retention.",
      pricing: {
        starter: "$3,500 — Single Platform App (iOS or Android)",
        standard: "$7,500 — Cross-Platform App"
      },
      ctaText: "Discuss Your Mobile App",
      ctaLink: "/contact?service=mobile",
    },
  ],

  workingProcess: {
    heading: "How I Work",
    introduction: "I believe in a <strong>straightforward, transparent approach</strong> focused on delivering <span class=\"text-emphasis\">real value</span>. Here's what you can expect when working with me:",
    steps: [
      "<strong>Initial Consultation</strong> — We discuss your needs, challenges, and goals to determine if we're a good fit.",
      "<strong>Proposal & Planning</strong> — I provide a clear proposal including scope, timeline, and cost estimates.",
      "<strong>Regular Updates</strong> — Ongoing communication throughout the project <em>with no surprises</em>.",
      "<strong>Delivery & Support</strong> — Thorough testing, documentation, and training where needed."
    ],
    principles: [
      "<strong>No Unnecessary Complexity</strong> — I won't overengineer solutions or add features you don't need.",
      "<strong>Practical Over Perfect</strong> — I focus on delivering <em>working solutions that solve real problems</em>, not theoretical perfection.",
      "<strong>Direct Communication</strong> — Clear, honest discussions about what's possible, what makes sense, and what to expect.",
      "<strong>Long-Term Thinking</strong> — Building with future maintenance and growth in mind, not just immediate needs."
    ]
  },

  callToAction: {
    heading: "<span class=\"gradient-text\">Ready to get started?</span>",
    content: "Let's talk about your project and how I can help. Whether you have a <strong>specific need in mind</strong> or just want to <strong>explore possibilities</strong>, I'm happy to have a no-pressure conversation about your options.",
    primaryCTA: {
      text: "Schedule a Free Consultation",
      link: "/contact"
    },
    secondaryCTA: {
      text: "View My Portfolio",
      link: "/portfolio"
    },
    availabilityNote: "<em>Currently booking new projects for June 2025 onward. Limited consulting slots available immediately.</em>"
  }
};

export default servicesContent;
