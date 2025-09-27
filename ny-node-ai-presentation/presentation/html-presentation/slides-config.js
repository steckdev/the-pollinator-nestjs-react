const SLIDES_CONFIG = {
  totalSlides: 16,
  slideData: [
    {
      id: 1,
      filename: "page1.html",
      title: "The Pollinator - Title Slide",
      description: "Introduction to NestJS architecture presentation",
      duration: 30,
      tags: ["title", "introduction"],
    },
    {
      id: 2,
      filename: "page2.html",
      title: "The Pollinator Metaphor",
      description:
        "Explaining the metaphor of pollinators and NestJS architecture",
      duration: 60,
      tags: ["metaphor", "concept"],
    },
    {
      id: 3,
      filename: "page3.html",
      title: "NestJS Architecture Overview",
      description: "High-level overview of NestJS architecture patterns",
      duration: 90,
      tags: ["architecture", "overview"],
    },
    {
      id: 4,
      filename: "page4.html",
      title: "Dependency Injection Patterns",
      description: "Deep dive into dependency injection in NestJS",
      duration: 120,
      tags: ["dependency-injection", "patterns"],
    },
    {
      id: 5,
      filename: "page5.html",
      title: "Modular Design Principles",
      description: "Building scalable applications with modular design",
      duration: 90,
      tags: ["modules", "design"],
    },
    {
      id: 6,
      filename: "page6.html",
      title: "Scaling Strategies",
      description: "Strategies for scaling NestJS applications",
      duration: 120,
      tags: ["scaling", "performance"],
    },
    {
      id: 7,
      filename: "page7.html",
      title: "Performance Optimization",
      description: "Optimizing NestJS applications for high performance",
      duration: 90,
      tags: ["performance", "optimization"],
    },
    {
      id: 8,
      filename: "page8.html",
      title: "Conclusion & Next Steps",
      description: "Wrapping up and next steps for implementation",
      duration: 60,
      tags: ["conclusion", "next-steps"],
    },
    {
      id: 9,
      filename: "page9.html",
      title: "NestJS Core Patterns Overview",
      description:
        "Showcasing Guards, Interceptors, Pipes, Decorators, and Dependency Injection",
      duration: 90,
      tags: ["patterns", "core", "architecture"],
    },
    {
      id: 10,
      filename: "page10.html",
      title: "Request Validation & DTOs",
      description:
        "ValidationPipe implementation and DTO patterns with code examples",
      duration: 120,
      tags: ["validation", "dto", "pipes"],
    },
    {
      id: 11,
      filename: "page11.html",
      title: "Authentication & Authorization",
      description:
        "JwtAuthGuard implementation and role-based access control patterns",
      duration: 120,
      tags: ["auth", "security", "guards"],
    },
    {
      id: 12,
      filename: "page12.html",
      title: "Interceptors & Cross-cutting Concerns",
      description:
        "LoggingInterceptor, ResponseTransformInterceptor, and CacheInterceptor examples",
      duration: 120,
      tags: ["interceptors", "aop", "cross-cutting"],
    },
    {
      id: 13,
      filename: "page13.html",
      title: "Custom Decorators & Developer Experience",
      description:
        "Creating custom decorators like @User and @Roles for better DX",
      duration: 90,
      tags: ["decorators", "dx", "custom"],
    },
    {
      id: 14,
      filename: "page14.html",
      title: "Vertical Scaling Strategies",
      description:
        "Growing feature complexity within modules and subdomain splitting",
      duration: 120,
      tags: ["vertical-scaling", "modules", "growth"],
    },
    {
      id: 15,
      filename: "page15.html",
      title: "Horizontal Scaling & Microservices",
      description:
        "Evolution from monolith to microservices and distributed architecture",
      duration: 150,
      tags: ["horizontal-scaling", "microservices", "distributed"],
    },
    {
      id: 16,
      filename: "page16.html",
      title: "Migration Strategy & Future Roadmap",
      description:
        "Migration strategy, operational readiness, and quarterly roadmap",
      duration: 120,
      tags: ["migration", "roadmap", "strategy"],
    },
  ],

  presentation: {
    title: "The Pollinator: Growth of NestJS Architecture",
    subtitle: "Scaling Node.js Applications with NestJS",
    author: "Tyler Steck",
    event: "International JavaScript Conference NYC 2025",
    date: "2025",
    location: "NYC",
    totalDuration: 1530, // Total duration in seconds (25.5 minutes)
  },

  navigation: {
    showDots: true,
    showProgress: true,
    showSlideNumbers: true,
    showTimer: false,
    autoAdvance: false,
    autoAdvanceDelay: 30000,
  },

  styling: {
    theme: "dark",
    primaryColor: "#10b981",
    secondaryColor: "#3b82f6",
    backgroundColor: "#000000",
    fontFamily: "Inter, sans-serif",
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SLIDES_CONFIG;
}
