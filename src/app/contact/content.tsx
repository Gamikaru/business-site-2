export const contactContent = {
  meta: {
    title: "Contact - Gavriel Rudolph",
    description: "Get in touch to discuss your project or technical needs.",
  },

  hero: {
    headline: "Let's Build Something <span class=\"text-emphasis\">Together</span>",
    subheading: "Have a project in mind? Send me a message and let's <strong>make it happen</strong>.",
    imageSrc: "/images/contact-header.jpg",
    imageAlt: "Digital collaboration concept",
  },

  basicInfo: {
    email: "<strong>gavriel@gamikaru.dev</strong>",
    phone: {
      us: "<strong>+1 813-534-2532</strong>",
      uk: "<strong>+44 787 523 5328</strong>"
    },
    workHours: "<em>Monday-Friday: 9AM - 5PM (EST)</em>",
    location: "<span class=\"badge\">Remote / Worldwide</span>"
  },

  availabilityStatus: {
    current: "<span class=\"status-badge\">Limited availability</span>",
    nextSlots: "<strong>Mid-May 2025</strong>",
    bookingInfo: "Currently accepting projects starting from <mark>June 2025</mark>",
    priorityProjects: "<em>AI implementations, web application development, and technical consulting</em>"
  },

  contactForm: {
    steps: [
      {
        id: "project-type",
        title: "<span class=\"step-title\">What would you like to create?</span>",
        fields: [
          {
            id: "project-type",
            type: "select",
            label: "Project Type",
            options: [
              "Web Application",
              "Mobile App",
              "AI/ML Solution",
              "Data Visualization",
              "Integration/API",
              "Other (please specify)"
            ]
          },
          {
            id: "budget",
            type: "number",
            label: "Budget",
            placeholder: "Enter an amount"
          },
          {
            id: "timeframe",
            type: "select",
            label: "Timeframe",
            options: [
              "Exploratory (no fixed date)",
              "Within 3 months",
              "Within 1 month",
              "ASAP (urgent)"
            ]
          }
        ]
      },
      {
        id: "project-details",
        title: "<span class=\"step-title\">Tell me more about your project</span>",
        fields: [
          {
            id: "details",
            type: "textarea",
            label: "Project Details",
            placeholder: "Share your vision, goals, or any specific requirements..."
          }
        ]
      },
      {
        id: "contact-info",
        title: "<span class=\"step-title\">How can I reach you?</span>",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Name",
            placeholder: "Your full name"
          },
          {
            id: "email",
            type: "email",
            label: "Email",
            placeholder: "your.email@example.com"
          },
          {
            id: "phone",
            type: "tel",
            label: "Phone (optional)",
            placeholder: "+1 (123) 456-7890"
          },
          {
            id: "preferred-communication",
            type: "select",
            label: "Preferred Communication",
            options: [
              "Email",
              "Phone",
              "Video Call"
            ]
          }
        ]
      }
    ],
    submitButton: {
      text: "Send Message"
    }
  },

  contactPreferences: {
    initialContact: "<strong>Email</strong> or <strong>contact form</strong>",
    responseTime: "Within <mark>24 hours</mark> on business days",
    consultationInfo: "<em>30-minute discovery calls</em> available by appointment",
    timeZones: "Available for meetings between <strong>8AM - 6PM EST</strong> (<strong>1PM - 11PM GMT</strong>)"
  },

  socialMedia: {
    primary: [
      {
        platform: "GitHub",
        url: "github.com/Gamikaru",
        description: "Explore my code repositories, open-source contributions, and development projects.",
        ctaText: "View My Code"
      },
      {
        platform: "LinkedIn",
        url: "linkedin.com/in/gavrielrudolph",
        description: "Connect professionally for opportunities, collaborations, and industry networking.",
        ctaText: "Let's Connect"
      },
      {
        platform: "Medium",
        url: "medium.com/@gavrielrudolph",
        description: "Read my articles on web development, AI, and technology strategy.",
        ctaText: "Read My Articles"
      }
    ],
    secondary: [
      {
        platform: "Twitter",
        url: "twitter.com/gavrielmiharu",
        description: "Technology insights, industry news, and development tips.",
        ctaText: "Follow Me"
      },
      {
        platform: "YouTube",
        url: "youtube.com/channel/gavrielmiharu",
        description: "Video tutorials, project walkthroughs, and coding sessions.",
        ctaText: "Subscribe"
      },
      {
        platform: "Dev.to",
        url: "dev.to/gavrielmiharu",
        description: "Technical articles and community engagement for developers.",
        ctaText: "Join the Discussion"
      }
    ]
  },

  networking: {
    heading: "Networking & <span class=\"text-emphasis\">Collaboration</span>",
    openTo: [
      "<span class=\"list-item\">Speaking engagements</span>",
      "<span class=\"list-item\">Guest blog contributions</span>",
      "<span class=\"list-item\">Podcast appearances</span>",
      "<span class=\"list-item\">Teaching/workshop opportunities</span>",
      "<span class=\"list-item\">Project collaborations</span>"
    ],
    expertise: [
      "<span class=\"expertise-item\">Web development best practices</span>",
      "<span class=\"expertise-item\">AI implementation for business</span>",
      "<span class=\"expertise-item\">Data-driven decision making</span>",
      "<span class=\"expertise-item\">Technology selection strategies</span>"
    ]
  },

  faq: {
    heading: "Common <span class=\"text-emphasis\">Questions</span>",
    questions: [
      {
        question: "<strong>How do you typically work with clients?</strong>",
        answer: "I start with a conversation to <em>understand your needs</em>, then provide a <strong>clear proposal</strong> with scope, timeline, and costs. During the project, I keep you <span class=\"text-emphasis\">updated regularly</span> and deliver work in stages for feedback. My goal is a <strong>straightforward process</strong> with no surprises."
      },
      {
        question: "Do you work with clients outside of Tampa?",
        answer: "Absolutely. While I'm based in Tampa, I work with clients worldwide. Most communication happens through video calls, email, and collaborative tools, making location largely irrelevant to a successful project."
      },
      {
        question: "What information do you need to provide an estimate?",
        answer: "The more detail you can provide about your goals, timeline, and specific requirements, the more accurate my estimate will be. Even a rough idea is a good starting point—we can refine the details during our initial conversation."
      },
      {
        question: "How do you handle revisions and feedback?",
        answer: "Feedback is built into my process. Each project includes dedicated review phases where you can provide input. My proposals clearly outline the number of revision rounds included, though I'm always flexible for reasonable adjustments."
      },
      {
        question: "Do you offer maintenance and support after launching?",
        answer: "Yes. I offer various support options once your project is live, from hourly assistance to monthly maintenance packages. We'll discuss what makes sense for your specific needs."
      }
    ]
  },

  finalCallout: {
    heading: "Not ready to start a project <em>yet</em>?",
    content: "If you're just exploring options or have questions about what might be possible, I'm happy to have a <strong>no-pressure conversation</strong>. Sometimes the best projects start with a simple discussion about challenges you're facing.",
    ctaText: "Schedule a Quick Chat",
    ctaLink: "/contact?type=consultation"
  },

  testimonial: {
    quote: "From our first call, Gavriel was <span class=\"text-emphasis\">refreshingly straightforward</span>. He asked <strong>smart questions</strong> about our business needs rather than jumping straight to technical solutions. The entire process was <em>smooth</em>, and we got <strong>exactly what we needed</strong> without unnecessary complications.",
    author: "Jennifer K.",
    role: "Marketing Director"
  }
};

export default contactContent;
