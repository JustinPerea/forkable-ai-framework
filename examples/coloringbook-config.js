// Example Configuration: ColoringBook AI
// This is the configuration file for the first example fork

const config = {
  // App Identity (overrides base config)
  app: {
    name: "ColoringBook AI Creator",
    version: "1.0.0",
    description: "Transform any photo into a coloring book sketch"
  },

  // Branding Configuration
  branding: {
    name: "ColoringBook AI",
    tagline: "Transform any photo into a coloring book sketch",
    description: "Upload your photo and get a beautiful black and white sketch perfect for coloring with crayons or markers",
    logo: "/assets/logo.png",
    favicon: "/assets/favicon.ico",
    headerImage: "/assets/header.jpg",
    examples: [
      {
        original: "/assets/example1-original.jpg",
        result: "/assets/example1-result.jpg",
        caption: "Portrait to coloring book sketch"
      },
      {
        original: "/assets/example2-original.jpg", 
        result: "/assets/example2-result.jpg",
        caption: "Landscape to coloring book sketch"
      },
      {
        original: "/assets/example3-original.jpg",
        result: "/assets/example3-result.jpg", 
        caption: "Animal to coloring book sketch"
      }
    ],
    meta: {
      title: "ColoringBook AI - Transform Photos to Coloring Book Sketches",
      description: "Convert any photo into a beautiful coloring book sketch. Perfect for kids and adults who love to color!",
      keywords: "coloring book, sketch, AI, photo transformation, coloring, black and white, outline",
      ogImage: "/assets/og-image.jpg"
    },
    colors: {
      primary: "#4F46E5", // Indigo
      secondary: "#10B981", // Emerald
      accent: "#F59E0B", // Amber
      background: "#F9FAFB", // Gray 50
      text: "#111827" // Gray 900
    }
  },

  // AI Configuration
  ai: {
    provider: "gemini",
            model: "gemini-2.5-flash", // Updated to latest Gemini 2.5 model
    prompt: "Convert this image into a black and white coloring book style sketch with clear outlines and no shading. Make it suitable for coloring with crayons or markers. Ensure the lines are bold and clear, and remove any background details that would be difficult to color.",
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9
    },
    imageSettings: {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: "high",
      format: "png"
    }
  },

  // Business Settings
  business: {
    freeGenerations: 3,
    tokenPrice: 0.10, // $0.10 per generation
    minDeposit: 5.00, // $5 minimum deposit
    currency: "USD",
    paymentProvider: "polar",
    subscriptionPlans: [
      {
        name: "Basic",
        price: 9.99,
        tokens: 100,
        features: ["100 generations", "High quality output", "Email support"]
      },
      {
        name: "Pro", 
        price: 19.99,
        tokens: 250,
        features: ["250 generations", "High quality output", "Priority support", "Bulk processing"]
      },
      {
        name: "Unlimited",
        price: 39.99,
        tokens: 1000,
        features: ["1000 generations", "High quality output", "Priority support", "Bulk processing", "API access"]
      }
    ]
  },

  // User Experience
  ux: {
    onboarding: {
      showTutorial: true,
      tutorialSteps: [
        "Upload or take a photo",
        "Click generate to create your sketch", 
        "Download and start coloring!"
      ]
    },
    features: {
      cameraAccess: true,
      dragAndDrop: true,
      batchProcessing: false,
      socialSharing: true,
      downloadFormats: ["PNG", "PDF"]
    }
  },

  // Deployment Configuration
  deployment: {
    domain: "coloringbook.ai",
    vercelProject: "coloringbook-ai",
    environment: "production",
    cdn: "vercel",
    analytics: {
      provider: "vercel",
      trackingId: "coloringbook-ai"
    }
  },

  // API Configuration
  api: {
    baseUrl: "https://api.coloringbook.ai",
    version: "v1",
    rateLimit: {
      requests: 100,
      window: "15m"
    },
    cors: {
      origin: ["https://coloringbook.ai", "https://www.coloringbook.ai"],
      credentials: true
    }
  },

  // Database Configuration
  database: {
    provider: "vercel-postgres",
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    pool: {
      min: 2,
      max: 10
    }
  },

  // Cache Configuration
  cache: {
    provider: "vercel-kv",
    connectionString: process.env.KV_URL,
    ttl: 3600 // 1 hour
  },

  // Monitoring and Logging
  monitoring: {
    provider: "vercel",
    logLevel: "info",
    errorTracking: true,
    performanceMonitoring: true,
    alerts: {
      errorRate: 5, // 5% error rate threshold
      responseTime: 2000 // 2 second response time threshold
    }
  },

  // Security Configuration
  security: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: "7d",
      refreshExpiresIn: "30d"
    },
    encryption: {
      algorithm: "aes-256-gcm",
      key: process.env.ENCRYPTION_KEY
    },
    rateLimit: {
      windowMs: 900000, // 15 minutes
      max: 100 // requests per window
    }
  }
};

module.exports = config;
